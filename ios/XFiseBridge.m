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
#import "RCTUtils.h"

@implementation XFiseBridge

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(initISE:(NSDictionary*)infos)
{
  NSLog(@"init ise");
  [_xunfei initISE:infos];
}

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

RCT_EXPORT_METHOD(pausePcm)
{
  [_xunfei pausePcm];
}

RCT_REMAP_METHOD(getPcmCurrentTime,
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  resolve([[NSNumber alloc]initWithDouble:[_xunfei getPcmCurrentTime]]);
}

RCT_REMAP_METHOD(initPcm,
                 infos:(NSDictionary*)infos
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
  NSString* filePath = [RCTConvert NSString:infos[@"FILE_PATH"]];
  NSString* rate = [RCTConvert NSString:infos[@"SAMPLE_RATE"]];
  long value = [rate intValue];
  
  BOOL ret = [_xunfei initPcm:filePath rate:value];
  if (ret){
    resolve([[NSNumber alloc]initWithDouble:[_xunfei getPcmLong]]);
  }else{
    reject(@"1", @"文件不存在或数据为空", nil);
  }
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
  _xunfei.xunfeiReact = self;
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
