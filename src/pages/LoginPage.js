import React, { useState, useEffect } from "react";
import { Dimensions, View, TextInput, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useRecoilState } from "recoil";
import { isLoggedInState } from "../atoms";
import * as Font from "expo-font";
const screenHeight = Dimensions.get("window").height;

const Login = () => {
    // useState : 아이디와 암호 입력 값을 저장
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);

    const navigation = useNavigation();

    const handleLogin = () => {
        //'handleLogin'함수는 "로그인" 버튼을 눌렀을 때 호출됨
        //버튼 클릭시 홈화면으로 이동(일시적)
        navigation.navigate("NavigationBar");

        //로그인 성공시, 로그인 상태 저장
        setIsLoggedIn(true);

        //ID 및 암호 확인 로직 작성 필요
        //로그인에 성공하면 navigation.navigate()를 사용하여 다음 화면으로 이동
    };

    const handleSignUp = () => {
        //회원가입 클릭시 회원가입 화면으로 이동
        navigation.navigate("SignUp");
    };

    return (
        <View style={styles.container}>
            <Image source={require("../../assets/logo/logo7.png")} style={{ width: 270, height: 60, margin: 5 }} />
            <TextInput style={styles.input} onChangeText={(text) => setId(text)} value={id} placeholder="아이디" />
            <TextInput style={styles.input} onChangeText={(text) => setPassword(text)} value={password} placeholder="비밀번호" secureTextEntry={true} />
            <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
                <View style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>로그인</Text>
                </View>
            </TouchableOpacity>
            <Text style={styles.signupText}>
                RideShare가 처음이신가요?{" "}
                <Text style={styles.signupLink} onPress={handleSignUp}>
                    회원가입
                </Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "#ffffff",
        paddingTop: screenHeight * 0.1,
    },
    input: {
        height: 40,
        width: "80%",
        borderColor: "gray",
        borderWidth: 1,
        margin: 5,
        padding: 10,
        backgroundColor: "#ffffff",
        color: "#D5D7F2",
        borderRadius: 10,
    },
    loginButton: {
        width: "80%",
    },
    buttonContainer: {
        backgroundColor: "#9196F2",
        alignItems: "center",
        padding: 10,
        marginTop: 10,
        borderRadius: 10,
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 16,
    },
    signupText: {
        marginTop: 20,
    },
    signupLink: {
        color: "#4541BF",
    },
});

export default Login;
