// react imports
import {
  SafeAreaView,
  Text,

  View,
} from 'react-native';

// customisation
import GlobalStyle from '../../assets/styles/GlobalStyle';

function Medication({ navigation }) {



 

  return (
    <SafeAreaView style={[GlobalStyle.container, GlobalStyle.androidSafeArea]}>
    
    
      {/*
   
       */}
      <View style={{ height: 210 }}>
        <Text style={GlobalStyle.welcomeText}>En página en contrucción </Text>

      
      
      </View>

      {
       }
      <View style={GlobalStyle.rowTwo}>
  
      </View>
    </SafeAreaView>
  );
}

export default Medication;
