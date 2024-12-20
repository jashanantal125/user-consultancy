import Header from "@/components/Header";
import { ConstantStrings } from "@/constants/ConstantStrings";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

const TermsAndCondition = () => {
  const router = useRouter();
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <WebView
          source={{
            uri: `${ConstantStrings.url.base_url}terms-and-conditions`,
          }}
          style={styles.webview}
        />
      </View>
    </View>
  );
};
export default TermsAndCondition;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
