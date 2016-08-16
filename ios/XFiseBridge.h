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

#define PCM_TOTALTIME @"0"//总时间
#define PCM_CURRENTTIME @"1"//当前时间
#define PCM_PLAYOVER @"2"//播放完毕
#define PCM_ERROR @"3"//错误信息

@interface XFiseBridge : NSObject<RCTBridgeModule>

-(void)start:(NSDictionary*) infos bridgeIndex:(NSString*)index bridgeCategory:(NSString*)category;
-(void)stop;
-(void)cancel;
-(void)iseCallback:(NSString*)code result:(NSString*) result;
-(void)iseVolume:(NSString*)volume;
-(void)playCallback:(NSString*)status msg:(NSString*)msg;
-(void)playPcm;
-(void)stopPcm;
-(void)pausePcm;

@property (nonatomic, retain)XunfeiISE* xunfei;
@property(nonatomic,strong)NSString* bridgeIndex;
@property(nonatomic,strong)NSString* bridgeCategory;
@property(nonatomic,strong)NSString* bridgeStatus;
@end
