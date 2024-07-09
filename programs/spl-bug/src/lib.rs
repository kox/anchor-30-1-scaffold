#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

use instructions::*;

pub mod instructions;

pub mod state;

declare_id!("3YUAooZywRhVz8fdsDAWMPy6xC6RNM8PSqSVwUCDz7EN");

#[program]
pub mod spl_bug {
    use super::*;

    pub fn create_page_visits(ctx: Context<CreatePageVisits>) -> Result<()> {
        create::create_page_visits(ctx)
    }
    
    pub fn increment_page_visits(ctx: Context<IncrementPageVisits>) -> Result<()> {
        increment::increment_page_visits(ctx)
    }
}
