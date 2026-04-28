export const JOINS = {
  digital: {
    shutdown:       '11',
    shutdownFb:     '11',
    sysBusyFb:      '12',
    startup:        '10',
    startupFb:      '10',
    mainPage:       '2',
    mainPageFb:     '2',
    welcomePage:    '1',
    welcomePageFb:  '1',

    volUp:          '31',
    volDown:        '32',
    volMute:        '33',
    volMuteFb:      '33',

    cdUp:           '34',
    cdDown:         '35',
    cdMute:         '36',
    cdMuteFb:       '36',
    
    //Mic Joins
    mic1LevelUp:    '51',
    mic1LevelDown:  '52',
    mic1Mute:       '53',
    mic1MuteFb:     '53',
    
    mic2LevelUp:    '54',
    mic2LevelDown:  '55',
    mic2Mute:       '56',
    mic2MuteFb:     '56',
    
    mic3LevelUp:    '57',
    mic3LevelDown:  '58',
    mic3Mute:       '59',
    mic3MuteFb:     '59',
    
    mic4LevelUp:    '60',
    mic4LevelDown:  '61',
    mic4Mute:       '62',
    mic4MuteFb:     '62',
    
    mic5LevelUp:    '63',
    mic5LevelDown:  '64',
    mic5Mute:       '65',
    mic5MuteFb:     '65',
   
    mic6LevelUp:    '66',
    mic6LevelDown:  '67',
    mic6Mute:       '68',
    mic6MuteFb:     '69',

    mic7LevelUp:    '70',
    mic7LevelDown:  '71',
    mic7Mute:       '72',
    mic7MuteFb:     '72',

    mic8LevelUp:    '73',
    mic8LevelDown:  '74',
    mic8Mute:       '75',
    mic8MuteFb:     '75',
  
    mic9LevelUp:    '76',
    mic9LevelDown:  '77',
    mic9Mute:       '78',
    mic9MuteFb:     '78',
  
    mic10LevelUp:    '79',
    mic10LevelDown:  '80',
    mic10Mute:       '81',
    mic10MuteFb:     '81',
   
    mic11LevelUp:    '82',
    mic11LevelDown:  '83',
    mic11Mute:       '84',
    mic11MuteFb:     '84',

    micGlobalMute:  '49',
    micGlobalMuteFb:'50',

    // Display controls
    disp1Power:      '121',
    disp1PowerFb:    '121',
    disp1Mute:       '122',
    disp1MuteFb:     '122',
    disp1VolUp:      '123',
    disp1VolDown:    '124',
    disp1Hdmi1:      '125',
    disp1Hdmi1Fb:    '125',
    disp1HDbaseT:    '127',
    disp1HDbaseTFb:  '127',
    disp1HdcpErr:    '130',

    output1Visible: 'd_out1_visible',
    output2Visible: 'd_out2_visible',

// CD Controls
    cdStop:         '21',
    cdPlay:         '22',
    cdPause:        '23',
    cdSearchFwd:    '24',
    cdSearchRev:    '25',
    cdSrcCd:        '26',
    cdSrcBt:        '27',
    cdSrcAux:       '28',

    // Feedback
    cdStopFb:       '21',
    cdPlayFb:       '22',
    cdPauseFb:      '23',
    cdSearchFwdFb:  '24',
    cdSearchRevFb:  '25',
    cdSrcCdFb:      '26',
    cdSrcBtFb:      '27',
    cdSrcAuxFb:     '28',
  },
  
  analog: {
    mic1Level:      '51',
    mic2Level:      '52',
    mic3Level:      '53',
    mic4Level:      '54',
    mic5Level:      '56',
    mic6Level:      '57',
    mic7Level:      '58',
    mic8Level:      '59',
    mic9Level:      '60',
    mic10Level:      '61',
    mic11Level:      '62',
    mic12Level:      '63',

    //Video Outputs
    output1Source:  '1',
    output1SourceFb:'1',
  },
  
  serial: {
    
    input1Label:    '1',
    input2Label:    '2',
    input3Label:    '3',
    input4Label:    '4',
    
    mic1Label:      '51',
    mic2Label:      '52',
    mic3Label:      '53',
    mic4Label:      '54',
    mic5Label:      '55',
    mic6Label:      '56',
    mic7Label:      '57',
    mic8Label:      '58',
    mic9Label:      '59',
    mic10Label:      '60',
    mic11Label:      '61',
    mic12Label:      '62',

    //volume page Labels
    //volume page removed for timberlin

    //CD Track Info
    cdTrackInfo:      '20',
  }
} as const;
