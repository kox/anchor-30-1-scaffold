use anchor_lang::prelude::*;

declare_id!("3YUAooZywRhVz8fdsDAWMPy6xC6RNM8PSqSVwUCDz7EN");

#[program]
pub mod spl_bug {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, name: String) -> Result<()> {
        let dao_account = &mut ctx.accounts.dao_account;

        dao_account.name = name;
        dao_account.owner = *ctx.accounts.payer.key;

        Ok(())
    }

    pub fn propose(ctx: Context<Propose>, proposal: String, whitelist: Vec<Pubkey>) -> Result<()> {
        let proposal_account = &mut ctx.accounts.proposal_account;

        proposal_account.proposal = proposal;
        proposal_account.votes = 0;
        proposal_account.dao_account = ctx.accounts.dao_account.key();
        proposal_account.whitelist = whitelist;

        Ok(())
    }

    pub fn vote(ctx: Context<VoteProposalAccount>) -> Result<()> {
        let proposal_account = &mut ctx.accounts.proposal_account;
        let payer = &ctx.accounts.payer;

        // check if the voter is in the whitelist
        if !proposal_account.whitelist.contains(payer.key) {
            return Err(ErrorCode::UnauthorizedVoter.into());
        }

        proposal_account.votes += 1;

        Ok(())

    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    payer: Signer<'info>,

    #[account(
        init,
        space = 8 + DaoAccount::INIT_SPACE,
        payer = payer,
    )]
    pub dao_account: Account<'info, DaoAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Propose<'info> {
    #[account(mut)]
    payer: Signer<'info>,

    #[account(
        init, 
        payer = payer,
        space = 8 + ProposalAccount::INIT_SPACE,
    )]
    pub proposal_account: Account<'info, ProposalAccount>,

    pub dao_account: Account<'info, DaoAccount>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct VoteProposalAccount<'info> {
    #[account(mut)]
    pub proposal_account: Account<'info, ProposalAccount>,
    
    pub payer: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct DaoAccount  {
    #[max_len(20)]
    pub name: String,
    pub owner: Pubkey,
}

#[account]
#[derive(InitSpace)]
pub struct ProposalAccount {
    pub dao_account: Pubkey,
    #[max_len(20)]
    pub proposal: String,
    pub votes: u64,
    #[max_len(20, 32)]
    pub whitelist: Vec<Pubkey>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("You are not authorized to vote on this proposal.")]
    UnauthorizedVoter,
}
