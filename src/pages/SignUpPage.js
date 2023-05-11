import React, { useState } from "react";
import { View, TextInput, Image, TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

// TODO : 학교 이메일 인증
const SignUp = () => {
    const screenHeight = Dimensions.get("window").height;
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");

    const navigation = useNavigation();

    const handleSignup = () => {
        // 사용자 데이터를 데이터베이스 또는 API에 저장하기 위한 로직 작성
        // 등록이 완료되면 로그인 화면으로 이동
        navigation.navigate("Login");
    };

    const handleLogin = () => {
        // 계정이 이미 있으면 로그인 화면으로 이동
        navigation.navigate("Login");
    };

    return (
        <View style={styles.container}>
            <Image source={require("../../assets/logo/logo7.png")} style={{ width: 270, height: 60, margin: 5 }} />
            <TextInput style={styles.input} onChangeText={(text) => setId(text)} value={id} placeholder="아이디" />
            <TextInput style={styles.input} onChangeText={(text) => setPassword(text)} value={password} placeholder="비밀번호" secureTextEntry={true} />
            <TextInput style={styles.input} onChangeText={(text) => setNickname(text)} value={nickname} placeholder="닉네임" />
            <TextInput style={styles.input} onChangeText={(text) => setEmail(text)} value={email} placeholder="이메일" keyboardType="email-address" />
            <TouchableOpacity onPress={handleSignup} style={styles.signupButton}>
                <View style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>회원가입</Text>
                </View>
            </TouchableOpacity>
            <Text style={styles.loginText}>
                이미 계정이 있으신가요?{" "}
                <Text style={styles.loginLink} onPress={handleLogin}>
                    로그인
                </Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    input: {
        height: 40,
        width: "80%",
        borderColor: "gray",
        borderWidth: 1,
        margin: 10,
        padding: 10,
        borderRadius: 10,
    },
    signupButton: {
        width: "80%",
        marginTop: 10,
    },
    buttonContainer: {
        backgroundColor: "#9196F2",
        alignItems: "center",
        padding: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: "white",
        fontSize: 16,
    },
    loginText: {
        marginTop: 20,
    },
    loginLink: {
        color: "#4541BF",
    },
});

export default SignUp;
