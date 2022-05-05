import { ActivityIndicator, StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, TextInput, Dimensions } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';

const Login = ({ navigation }) => {

    const [loading, setLoading] = useState(false);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [key, onChangeKey] = useState('accessToken');

    useEffect(() => {
        getValueFor(key);
    }, []);

    async function getValueFor(key) {
        let result = await SecureStore.getItemAsync(key);
        if (result) {
            navigation.replace("Dashboard");
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle: { backgroundColor: "#ffafbd", borderBottomWidth: 0, shadowColor: 'transparent', elevation: 0, },
            headerTitleStyle: { color: "#ffafbd" },
            headerTintColor: "#ffafbd",
        });
    }, [navigation]);

    const signIn = async () => {
        setLoading(true);
        if (username.trim().length != 0 && password.trim().length != 0) {
            try {
                const response = await fetch('http://34.245.213.76:3000/auth/signin', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password,
                    }),
                });
                const json = await response.json();

                if (json.accessToken != null) {
                    await SecureStore.setItemAsync(key, json.accessToken);
                    navigation.navigate("Dashboard");
                } else {
                    alert('invalid credentials');
                }
            } catch (error) {
                console.error(error);
            }
        } else {
            alert('invalid inputs');
        }
        setLoading(false);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.viewContainer}>
                <LinearGradient
                    // Background Linear Gradient
                    colors={['#ffafbd', '#ffc3a0']}
                    style={styles.background}
                />
                <Text style={styles.text}>Login</Text>
                <View style={styles.marginVertical}></View>
                <View style={styles.sectionStyle}>
                    <TextInput style={{ flex: 1 }} placeholder="Username" textContentType="username" value={username} onChangeText={(text) => setUsername(text)} />
                </View>
                <View style={styles.sectionStyle}>

                    <TextInput style={{ flex: 1 }} placeholder="Password" secureTextEntry textContentType="password" value={password} onChangeText={(text) => setPassword(text)} />
                </View>

                <TouchableOpacity onPress={signIn} disabled={loading}>
                    <LinearGradient
                        // Button Linear Gradient
                        colors={['#2193b0', '#6dd5ed']}
                        start={[0.0, 0.5]}
                        end={[1.0, 0.5]}
                        locations={[0.0, 1.0]}
                        style={styles.button}>
                        <Text style={styles.textButton}>Login</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <ActivityIndicator size="small" color="#2193b0" animating={loading} />
                <View style={{ height: 20 }} />
                <View style={styles.row}>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

export default Login

const styles = StyleSheet.create({
    sectionStyle: {
        alignItems: "center",
        width: 322,
        borderColor: 'transparent',
        borderWidth: 2,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DFC9D7',
        paddingLeft: 15,
        marginTop: 15,
        marginBottom: 0,
        borderRadius: 10,
        fontSize: 14,
    },
    imageStyle: {
        padding: 10,
        margin: 1,
        height: 27,
        width: 37,
        resizeMode: 'stretch',
        alignItems: 'center',
    },
    background: {
        flex: 1,
        position: 'absolute',
        opacity: 1,
        left: 0,
        right: 0,
        top: 0,
        height: Dimensions.get('screen').height,
    },
    row: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: 'space-between',
    },
    marginVertical: {
        marginTop: 80
    },
    text: {
        marginTop: 60,
        color: "white",
        fontSize: 30,
        fontWeight: "bold",
    },
    text2: {
        marginTop: 70,
        fontSize: 15,
        color: "white",
    },
    text3: {
        fontSize: 20,
        color: "white",
        fontWeight: "bold",
    },
    text4: {
        marginTop: 10,
        marginLeft: 170,
        fontSize: 15,
        color: "white",
    },
    textButton: {
        color: "white",
        fontSize: 17,
        fontWeight: "bold",
    },
    button: {
        width: 322,
        alignItems: "center",
        backgroundColor: "#800080",
        paddingLeft: 40,
        paddingRight: 40,
        padding: 10,
        borderRadius: 15,
        marginTop: 30,
        marginBottom: 20,
    },
    registerButton: {
        width: 322,
        alignItems: "center",
        backgroundColor: "#223B80",
        paddingLeft: 40,
        paddingRight: 40,
        padding: 20,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 30
    },
    buttonText: {
        color: "white",
        borderRadius: 30,
    },
    registerText: {
        color: "white",
    },
    viewContainer: {
        alignItems: "center",
    },
});