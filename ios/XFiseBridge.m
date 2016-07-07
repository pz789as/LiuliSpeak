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

RCT_EXPORT_METHOD(playPcm)
{
  [_xunfei playPcm];
}

RCT_EXPORT_METHOD(stopPcm)
{
  [_xunfei stopPcm];
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

-(void)playCallback:(NSString*)status
{
  [_bridge.eventDispatcher
   sendDeviceEventWithName:@"playCallback"
   body:@{
          @"status":status
          }];
}

@end
