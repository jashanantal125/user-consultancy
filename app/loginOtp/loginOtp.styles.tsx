import styled from "styled-components/native";
import { TextInput } from "react-native";

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #f5f5f5;
`;

export const Header = styled.View`
  background-color: ${({ theme }) => theme.colors.primary};
  width: 100%;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  flex-direction: row;
  padding: 40px 20px 20px;
`;

export const BackButton = styled.TouchableOpacity`
  padding: 10px;
`;

export const BackText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const Title = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.secondary};
  text-align: center;
  flex: 1;
  left: -20px;
`;

export const Content = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin-top: -20px;
`;

export const Subtitle = styled.Text`
  font-size: 16px;
  color: #555;
  margin-bottom: 20px;
  text-align: center;
`;

export const OtpContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 80%;
  margin-top: 20px;
`;

export const OtpInput = styled(TextInput)`
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.primary};
  border-radius: 5px;
  width: 50px;
  height: 50px;
  text-align: center;
  font-size: 18px;
  background-color: #fff;
  color: ${({ theme }) => theme.colors.primary};
`;

export const SubmitButton = styled.Pressable`
  position: absolute;
  bottom: 30px;
  left: 20px;
  right: 20px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 22px;
  shadow-color: black;
  shadow-offset: { width: 0, height: 2 };
  shadow-opacity: 0.2;
  shadow-radius: 2px;
`;

export const ButtonText = styled.Text`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  padding: 12px;
`;
