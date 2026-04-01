export const JOINS = {
  digital: {
    shutdown:       '11',
    shutdownFb:     '11',
    startupFb:      'd_system_startup_fb',
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
    
    
    output1Visible: 'd_out1_visible',
    output2Visible: 'd_out2_visible',
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