/*import * as Device from 'expo-device';
import { Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedIcon } from '@/components/animated-icon';
import { HintRow } from '@/components/hint-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

function getDevMenuHint() {
  if (Platform.OS === 'web') {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroSection}>
          <AnimatedIcon />
          <ThemedText type="title" style={styles.title}>
            Welcome to&nbsp;Expo
          </ThemedText>
        </ThemedView>

        <ThemedText type="code" style={styles.code}>
          get started
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.stepContainer}>
          <HintRow
            title="Try editing"
            hint={<ThemedText type="code">src/app/index.tsx</ThemedText>}
          />
          <HintRow title="Dev tools" hint={getDevMenuHint()} />
          <HintRow
            title="Fresh start"
            hint={<ThemedText type="code">npm run reset-project</ThemedText>}
          />
        </ThemedView>

        {Platform.OS === 'web' && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: 'center',
  },
  code: {
    textTransform: 'uppercase',
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
});*/

import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index(){
  const styles = StyleSheet.create({
    container:{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      paddingTop: 120,
      paddingBottom: 40,
      paddingHorizontal: 20
    },
    headerText:{
      color: 'white',
      fontSize: 45,
      fontWeight: 'bold'
    },
    subText:{
      color: 'white',
      fontSize: 25,
    },
    loginButton:{
      backgroundColor: '#636AE8FF',
      borderRadius: 25,
      height: 40,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '80%'
    },
    buttonView:{
      width:'100%',
      alignItems: 'center',
      gap: 30
    },
    buttontext:{
      color: 'white'
    },
    signupText:{
      color: '#A8ADB7FF'
    },
    signupLink:{
      color: '#636AE8FF'
    }
  })
  return(
    <SafeAreaView style={{flex: 1, backgroundColor: '#1E2128FF'}}>
      <View style={styles.container}>
        <View style={{gap: 30, alignItems: 'center'}}>
          <Text style={styles.headerText}>GLSocial</Text>
          <Text style={styles.subText}>Discover</Text>
          <Text style={styles.subText}>Discuss</Text>
          <Text style={styles.subText}>Connect</Text>
          <Text style={styles.subText}>GL Content</Text>
        </View>
        <View style={styles.buttonView}>
          <Link href="/login" push asChild>
            <TouchableOpacity style={styles.loginButton}>
              <Text style={styles.buttontext}>Login</Text>
            </TouchableOpacity>
          </Link>
          <Text style={styles.signupText}> Don't have an account? <Link href="/signup" push asChild>
          <Text style={styles.signupLink}>Sign Up</Text>
          </Link> </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}
