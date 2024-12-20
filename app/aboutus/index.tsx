import { useRouter } from "expo-router";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAboutUs } from "../../hooks/useAboutUs";
import { useEffect, useState } from "react";
import RenderHTML from "react-native-render-html";

const AboutUs = () => {
  const aboutUs = useAboutUs();
  const [aboutData, setAboutData] = useState();
  const contentWidth = Dimensions.get("window").width;

  const handleAboutUs = async () => {
    const response = await aboutUs.mutateAsync();
    setAboutData(response.data.data[0]);
  };
  useEffect(() => {
    handleAboutUs();
  }, []);
  return (
    <ScrollView style={styles.container}>
      <RenderHTML
        contentWidth={contentWidth}
        source={{ html: aboutData?.content }}
      />
    </ScrollView>
  );
};
export default AboutUs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
});
