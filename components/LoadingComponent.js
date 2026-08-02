import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'; 

function LoadingComponent() { 
    return (
        <View style={styles.loadingView}>
            <ActivityIndicator size="large" color="#5637DD" /> 
            <Text style={styles.loadingText}>Loading . . .</Text>
        </View>
    )
} 

const styles = StyleSheet.create({ 
    loadingView: { 
        alignItems: 'center',
        justifyContent: 'center', 
        flex: 1
    }, 
    loadingText: {
        fontSize: 14,
        color: '#5637DD',
        fontWeight: 'bold',
    }
})

export default LoadingComponent; 

