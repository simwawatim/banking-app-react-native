import { router } from 'expo-router';
import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SplashScreen() {
  const handleGetStarted = () => {
    router.push('/login')
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#170556" />
      
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/credit-card.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Welcome to CreditApp</Text>
        <Text style={styles.subtitle}>
          Manage your finances{'\n'}seamlessly and securely
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Get Started →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#170556',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  imageContainer: {
    width: 140,
    height: 140,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  image: {
    width: 90,
    height: 90,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#B8B0D4',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#E6DEE8',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#170556',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});