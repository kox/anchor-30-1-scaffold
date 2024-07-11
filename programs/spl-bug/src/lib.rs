use anchor_lang::prelude::*;

declare_id!("3YUAooZywRhVz8fdsDAWMPy6xC6RNM8PSqSVwUCDz7EN");

#[program]
pub mod spl_bug {
    use super::*;

    /* pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    } */

    pub fn initialize_marketplace(ctx: Context<InitializeMarketplace>) -> Result<()> {
        let marketplace = &mut ctx.accounts.marketplace;

        marketplace.owner = ctx.accounts.user.key();
        marketplace.listing_count = 0;
        
        Ok(())
    }
}

/* #[derive(Accounts)]
pub struct Initialize {}
 */

#[derive(Accounts)]
pub struct InitializeMarketplace<'info> {
    #[account(init, payer = user, space = 8 + Marketplace::INIT_SPACE)]
    pub marketplace: Account<'info, Marketplace>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Marketplace {
    pub owner: Pubkey,
    pub listing_count: u64,
}

#[account]
#[derive(InitSpace)]
pub struct Listing {
    pub marketplace: Pubkey,
    pub seller: Pubkey,
    #[max_len(20)]
    pub item: String,
    pub price: u64,
    pub active: bool,
}

#[account]
#[derive(InitSpace)]
pub struct Order {
    pub listing: Pubkey,
    pub buyer: Pubkey,
    pub amount: u64,
    pub completed: bool,
}

#[error_code]
pub enum MarketplaceError {
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,
    #[msg("Insufficient funds.")]
    InsufficientFunds,
    #[msg("Listing not found.")]
    ListingNotFound,
    #[msg("Order not found.")]
    OrderNotFound,
}