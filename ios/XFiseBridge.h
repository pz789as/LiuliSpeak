//
//  XFiseBridge.h
//  LiuliSpeak
//
//  Created by guojicheng on 16/6/27.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "RCTBridgeModule.h"

@class XunfeiISE;

#define CB_CODE_RESULT @"0"
#define CB_CODE_ERROR @"1"
#define CB_CODE_STATUS @"2"
#define CB_CODE_LOG @"3"

#define SPEECH_START @"0"  //开始
#define SPEECH_WORK @"1" //工作中
#define SPEECH_RECOG @"2"  //评测中
#define SPEECH_STOP @"3" //停止

@interface XFiseBridge : NSObject<RCTBridgeModule>

-(void)start:(NSDictionary*) infos;
-(void)stop;
-(void)cancel;
-(void)iseCallback:(NSString*)code result:(NSString*) result;
-(void)iseVolume:(NSString*)volume;
-(void)playCallback:(NSString*)status;
-(void)playPcm;
-(void)stopPcm;

@property (nonatomic, retain)XunfeiISE* xunfei;

@end
