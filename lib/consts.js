export const ADDRESS = 0x3f
export const PORT = 0x01

export const displayON = 0xaf //display on.

export const startLine = 0x40 //Set display start line.
export const restart = 0xe2 //restart command.
export const seg = 0xa0 //Set scan direction of SEG, SEG = 1-0-1-0-0-0-0-MX;

export const BS = 0xa3 //select bias setting, bias = 1-0-1-0-0-0-1-BS, BS(0)=1/9,  BS(1)=1/7(at 1/65 duty).
export const com = 0xc8 //Set output direction of COM, COM = 1-1-0-0-MY-X-X-X;

export const powerCon1 = 0x2c //Controls the built-in power circuits;
export const powerCon2 = 0x2e //Define instructions on page 43 of the ST7567A data sheet.
export const powerCon3 = 0x2f

/********Adjust display brightness********/
export const regRatio = 0x22 //Controls the regulation ratio of the built-in regulator;
//Define instructions on page 43 of the ST7567A data sheet.
export const EV1 = 0x81 //Define instructions on page 44 of the ST7567A data sheet.
export const EV2 = 0x30

/**********entension command set**********/
export const exit_EC = 0xfe //exit extension command set.
export const enter_EC = 0xff //enter extension command set.

export const DSM_ON = 0x72 //display setting mode on.
export const DT = 0xd6 //set the display duty, DT=33.
export const BA = 0x90 //BA=1/9, selects LCD bias ratio for the internal voltage follower to drive the LCD.
//This command has priority over the Bias Select (BS).
export const FR = 0x9d //specifies the frame rate for duty.
