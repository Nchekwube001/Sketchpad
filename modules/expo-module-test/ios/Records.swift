//
//  Records.swift
//  ExpoModuleTest
//
//  Created by francis on 31/07/2025.
//

import Foundation
import ExpoModulesCore


struct TestModuleModel:Record{
    @Field
    var isAvailable:Bool = false
    
    @Field
    var reason:String? = nil
    
    @Field
    var osVersion:String = ProcessInfo.processInfo.operatingSystemVersionString
}
