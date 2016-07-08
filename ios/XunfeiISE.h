//
//  XunfeiISE.h
//  LiuliSpeak
//
//  Created by guojicheng on 16/6/27.
//  Copyright © 2016年 Facebook. All rights reserved.
//


#import <UIKit/UIKit.h>
#import "iflyMSC/iflyMSC.h"

#define APPID_VALUE @"5743f74a"

@class XFiseBridge;

@interface XunfeiISE : UIViewController<IFlySpeechEvaluatorDelegate>

@property (nonatomic,strong)IFlySpeechEvaluator *evaluatorIns;
@property (nonatomic, strong) NSString *pcmFilePath;//音频文件路径

-(void)startEvaluator:(NSDictionary *)infos iseBridge:(XFiseBridge*)iseBridge;
-(void)stopEvaluator;
-(void)cancelEvaluator;
-(void)playPcm;
-(void)stopPcm;
-(void)pausePcm;
-(double)getPcmLong;
-(BOOL)initPcm:(NSString*) filePath rate:(long)rate;
-(double)getPcmCurrentTime;


@property (nonatomic,retain)XFiseBridge* xunfeiReact;

@end
