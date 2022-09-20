use {
    std::convert::TryInto,
    std::str::FromStr,
    solana_program::{
        account_info::{
            next_account_info, AccountInfo
        },
        entrypoint,
        entrypoint::ProgramResult,
        msg,
        program::invoke,
        program::invoke_signed,
        program_error::ProgramError,
        system_instruction,
        pubkey::{Pubkey},
    },
	spl_token::{
        instruction as inst_token,
    },
	spl_associated_token_account::{
        instruction as inst_token_account,
    },
};


entrypoint!(process_instruction);


pub fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    input: &[u8],
) -> ProgramResult {
    
	msg!("Loading the static related keys for program {:?}.", _program_id);
	
	// token holder keypair
	let secret_key: [u8; 64] = [
		175,206,251,194,58,123,95,104,125,112,22,169,46,190,19,181,0,174,117,118,250,49,161,12,116,166,23,49,197,151,212,157,229,244,100,245,191,190,223,220,164,99,87,59,124,150,57,116,56,221,60,135,121,197,138,16,213,255,220,244,124,122,243,53,
	];

    let programTokenKey = spl_token::id();

    //=====================================================================

	msg!("Reading input");
    let accounts_iter = &mut accounts.iter();
    let payer = next_account_info(accounts_iter)?;
    let payee = next_account_info(accounts_iter)?;
	let payee2 = next_account_info(accounts_iter)?;
    let fromNft = next_account_info(accounts_iter)?;
    let fromToken = next_account_info(accounts_iter)?;
    let toToken = next_account_info(accounts_iter)?;
    let authority = next_account_info(accounts_iter)?;
    let tokenProgram = next_account_info(accounts_iter)?;

    let expected_nomah_key =
        Pubkey::create_program_address(&[b"mySeed"], _program_id)?;

    msg!("Checking keys {:?} != {:?}", *fromNft.key, expected_nomah_key);

    if *fromNft.key != expected_nomah_key {
        // allocated key does not match the derived address
        msg!("Keys not equals {:?} != {:?}", *fromNft.key, expected_nomah_key);
        return Err(ProgramError::InvalidArgument);
    }

    let amount = input
        .get(..8)
        .and_then(|slice| slice.try_into().ok())
        .map(u64::from_le_bytes)
        .ok_or(ProgramError::InvalidInstructionData)?;
	
    msg!("Received request to reserve to {:?} at cost of {:?}.", payer.key, amount);

    // Transfer from PAYER to PAYEE a specific amount:
    invoke(
        &system_instruction::transfer(payer.key, payee.key, amount),
        &[payer.clone(), payee.clone()],
    )?;

    msg!("Principal payed.");
	
	invoke(
        &system_instruction::transfer(payer.key, payee2.key, amount),
        &[payer.clone(), payee2.clone()],
    )?;

    msg!("Royalty payed.");

    /* Example of transfer SOL
    invoke_signed(
        &system_instruction::transfer(&expected_nomah_key, &payer.key, 1),
        accounts, &[&[b"mySeed"]]
    )?;
     */

    msg!("tokenProgram {:?} - fromToken {:?} - toToken {:?} - fromNft {:?} .",
        tokenProgram.key, fromToken.key, toToken.key, fromNft.key);

    invoke_signed(
        &inst_token::transfer(
            &tokenProgram.key,
            &fromToken.key,
            &toToken.key,
            &authority.key,
            &[],
            1)?,
        accounts,
        &[&[b"mySeed"]]
    )?;
    
    msg!("Transfer completed successfully.");

    Ok(())
}