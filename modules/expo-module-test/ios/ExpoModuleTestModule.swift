import ExpoModulesCore
import CoreMotion
public class ExpoModuleTestModule: Module {
    let kOnStepCounted = "onStepCounted"
    
    public func definition() -> ModuleDefinition {
        let pedemeter = CMPedometer()
        Name("ExpoModuleTest")
        
        Events(kOnStepCounted)
        
        Function("requestPermissions"){
            pedemeter.stopEventUpdates()
        }
        
        Function("startSendingData"){
            pedemeter.startUpdates(from: Date()) {  pedometerData, error in
                guard let pedometerData = pedometerData, error == nil else {return}
                
                self.sendEvent(self.kOnStepCounted,[
                    "step":pedometerData.numberOfSteps.intValue
                                                   
                    ])
            }
        }
    }
}
