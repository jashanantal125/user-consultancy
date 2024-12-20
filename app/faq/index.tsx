import { useEffect, useState } from "react";
import { FlatList, Text } from "react-native";
import { View } from "react-native";
import { useGetFaq } from "../../hooks/useGetFaq";
import { TouchableOpacity } from "react-native";
import Collapsible from "react-native-collapsible";
import { StyleSheet } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

const FAQ = () => {
  const [faq, seFaq] = useState();
  const [activeIndex, setActiveIndex] = useState(null);

  const getFaq = useGetFaq();

  const handleGetFaq = async () => {
    try {
      const response = await getFaq.mutateAsync();
      seFaq(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const renderFAQItem = ({ item, index }) => {
    const isActive = activeIndex === index;

    return (
      <View style={styles.accordionContainer}>
        <TouchableOpacity
          onPress={() => toggleAccordion(index)}
          style={styles.accordionHeader}
        >
          <Text style={styles.headerText}>{item.question}</Text>
          <Text style={styles.arrow}>
            {isActive ? (
              <AntDesign name="minus" size={20} color="black" />
            ) : (
              <AntDesign name="plus" size={20} color="black" />
            )}
          </Text>
        </TouchableOpacity>
        <Collapsible collapsed={!isActive}>
          <View style={styles.accordionContent}>
            <Text style={styles.contentText}>{item.answer}</Text>
          </View>
        </Collapsible>
      </View>
    );
  };
  useEffect(() => {
    handleGetFaq();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <FlatList
        data={faq}
        keyExtractor={(item) => item.name}
        renderItem={renderFAQItem}
        contentContainerStyle={styles.container}
      />
    </View>
  );
};

export default FAQ;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  accordionContainer: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    overflow: "hidden",
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 15,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  arrow: {
    fontSize: 16,
    color: "#888",
  },
  accordionContent: {
    backgroundColor: "#fff",
    padding: 15,
  },
  contentText: {
    fontSize: 14,
    color: "#555",
  },
});
