use anchor_lang::prelude::*;

declare_id!("3YUAooZywRhVz8fdsDAWMPy6xC6RNM8PSqSVwUCDz7EN");

#[program]
pub mod spl_bug {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
