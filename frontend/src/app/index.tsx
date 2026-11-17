import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { FONTSIZE, COLORS, SIGNUPBUTTON } from "@/styles/theme";
import { SafeAreaView } from "react-native-safe-area-context"
import { Link } from "expo-router"


/*
  Look into changing Link labels 
  bringing all sign up button to one style can one allow changes but if anything goes wrong
  all signup button will be messed up
*/



export default function Index() {
  return (
    <SafeAreaView style={ styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}> GLSocial</Text>
        <Text style={styles.subText}> Discover</Text>
        <Text style={styles.subText}> Discuss</Text>
        <Text style={styles.subText}> Connect</Text>
        <Text style={styles.subText}> GL Content</Text>
      </View>
      <View style={styles.choice}>
        <Link testID="login-link" href="/login" push asChild>
            <TouchableOpacity style={styles.loginButton} testID="login-button">
              <Text style={styles.text}>Login</Text>
            </TouchableOpacity>
         </Link>
         <Text style={styles.text}> Don't have an account? <Link href="/signup" push asChild><Text style={{color: COLORS.button}}>Sign up</Text></Link></Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: COLORS.background,
    flexDirection: "column",
    justifyContent: "space-between",
    paddingTop: 100,
    paddingBottom: 40,
    width: '100%'
  },
  headerText:{
    fontSize: FONTSIZE.header,
    color: COLORS.text,
    fontWeight: 'bold'
  },
  subText: {
    color: COLORS.text,
    fontSize: FONTSIZE.subText
  },
  header:{
    alignItems: 'center',
    gap: 30
  },
  choice:{
    width: '100%',
    alignItems: 'center',
    gap: 20
  },
  loginButton:{
    backgroundColor: SIGNUPBUTTON.backgroundColor,
    borderRadius: SIGNUPBUTTON.borderRadius,
    height: SIGNUPBUTTON.height,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%'
  },
  text:{
    color: COLORS.text,
    fontSize: FONTSIZE.regular
  }
});