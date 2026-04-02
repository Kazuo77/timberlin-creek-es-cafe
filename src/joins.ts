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
    
    micGlobalMute:  '50',
    micGlobalMuteFb:'50',

    // Display controls
    disp1Power:      '81',
    disp1PowerFb:    '81',
    disp1Mute:       '82',
    disp1MuteFb:     '82',
    disp1VolUp:      '83',
    disp1VolDown:    '84',
    disp1Hdmi1:      '85',
    disp1Hdmi1Fb:    '85',
    disp1Hdmi2:      '86',
    disp1Hdmi2Fb:    '86',
    disp1HdcpErr:    '87',

    disp2Power:      '91',
    disp2PowerFb:    '91',
    disp2Mute:       '92',
    disp2MuteFb:     '92',
    disp2VolUp:      '93',
    disp2VolDown:    '94',
    disp2Hdmi1:      '95',
    disp2Hdmi1Fb:    '95',
    disp2Hdmi2:      '96',
    disp2Hdmi2Fb:    '96',
    disp2HdcpErr:    '97',

    
    output1Visible: 'd_out1_visible',
    output2Visible: 'd_out2_visible',

// CD Controls
    cdOpenClose:     'd_cd_open_close',
    cdPlayPause:     'd_cd_play_pause',
    cdStop:          'd_cd_stop',
    cdSearchBack:    'd_cd_search_back',
    cdSearchFwd:     'd_cd_search_fwd',
    cdDisplay:       'd_cd_display',
    cdFolderBack:    'd_cd_folder_back',
    cdFolderFwd:     'd_cd_folder_fwd',


  },
  
  analog: {
    volGauge:       '30',
    cdGauge:        '31',
    mic1Level:      '51',
    mic2Level:      '52',
    mic3Level:      '53',
    mic4Level:      '54',
    mic5Level:      '55',

    //Video Outputs
    output1Source:  '1',
    output2Source:  '2',
    output1SourceFb:'1',
    output2SourceFb:'2',
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

    //volume page Labels
    vol1Label:       '31',
    vol2Label:       '32',
  }
} as const;