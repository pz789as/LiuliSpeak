//
//  XFiseBridge.m
//  LiuliSpeak
//
//  Created by guojicheng on 16/6/27.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "XFiseBridge.h"
#import "RCTEventDispatcher.h"
#import "RCTConvert.h"
#import "XunfeiISE.h"

@implementation XFiseBridge

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(start:(NSDictionary*) infos)
{
  NSLog(@"start ise");
  [_xunfei startEvaluator:infos iseBridge:self];
}

-(dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

RCT_EXPORT_METHOD(stop)
{
  NSLog(@"stop ise");
  [_xunfei stopEvaluator];
}

RCT_EXPORT_METHOD(cancel)
{
  NSLog(@"cancel ise");
  [_xunfei cancelEvaluator];
}

RCT_EXPORT_METHOD(initPcm:(NSDictionary*) infos)
{
  NSString* filePath = [RCTConvert NSString:@"FILE_PATH"];
  [_xunfei initPcm:filePath];
}

RCT_EXPORT_METHOD(playPcm)
{
  [_xunfei playPcm];
}

RCT_EXPORT_METHOD(stopPcm)
{
  [_xunfei stopPcm];
}

RCT_EXPORT_METHOD(getPcmCurrentTime)
{
  [_xunfei getPcmCurrentTime];
}


-(NSDictionary*) constantsToExport
{
  return @{
           @"CB_CODE_RESULT":@"0",
           @"CB_CODE_ERROR":@"1",
           @"CB_CODE_STATUS":@"2",
           @"CB_CODE_LOG":@"3",
           
           @"SPEECH_START":@"0",
           @"SPEECH_WORK":@"1",
           @"SPEECH_RECOG":@"2",
           @"SPEECH_STOP":@"3",
           
           @"PCM_TOTALTIME":@"0",//总时间
           @"PCM_CURRENTTIME":@"1",//当前时间
           @"PCM_PLAYOVER":@"2",//播放完
           @"PCM_ERROR":@"3"//错误信息
           };
}

@synthesize bridge = _bridge;

-(instancetype)init
{
  self = [super init];
  _xunfei = [[XunfeiISE alloc] init];
  return self;
}

-(void)iseCallback:(NSString*)code result:(NSString*) result
{
  [_bridge.eventDispatcher
   sendDeviceEventWithName:@"iseCallback"
   body:@{
          @"code":code,
          @"result":result
          }];
}

-(void)iseVolume:(NSString*)volume
{
  [_bridge.eventDispatcher
   sendDeviceEventWithName:@"iseVolume"
   body:@{
          @"volume":volume
          }];
}

-(void)playCallback:(NSString*)status msg:(NSString*)msg
{
  [_bridge.eventDispatcher
   sendDeviceEventWithName:@"playCallback"
   body:@{
          @"status":status,
          @"msg":msg
          }];
}

@end
