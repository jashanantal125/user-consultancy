import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import categories from "../../Data/categories.json";
import CategoriesIcon from "../../assets/images/category_icon.png";
import Carousel from "react-native-reanimated-carousel";
import { useCallback, useEffect, useState } from "react";
import counsellorsData from "../../Data/councellorsData.json";
import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";
import testimonialsList from "../../Data/testimonialsList.json";
import { useGetBanner } from "../../hooks/useGetBanner";
import { ConstantStrings } from "@/constants/ConstantStrings";
import { useGetConsultantCategories } from "../../hooks/useGetConsultantCategories";
import { useGetTestimonials } from "../../hooks/useGetTestimonials";
import { useUserStore } from "@/stores/userStore";
import { useAuthStore } from "@/stores/authStore";
import { useGetConsultantList } from "../../hooks/useGetConsultantList";
import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSendChatRequest } from "../../hooks/useSendChatRequest";
import { useCheckWalletBalance } from "../../hooks/useCheckWalletBalance";

const { width } = Dimensions.get("window");

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonialCurrentIndex, setTestimonialCurrentIndex] = useState(0);
  const getBanners = useGetBanner();
  const [banners, setBanners] = useState();
  const [categoriesList, setCategoriesList] = useState();
  const [testimonials, setTestimonials] = useState();
  const getConsultantCategories = useGetConsultantCategories();
  const getTestimonials = useGetTestimonials();
  const { clearEmail } = useUserStore.getState();
  const { clearAuth } = useAuthStore.getState();
  const getConsultantList = useGetConsultantList();
  const [listCategory, setListCategory] = useState("Astrologers");
  const [consultantList, setConsultantList] = useState();
  const sendChatRequest = useSendChatRequest();
  const checkWalletBalance = useCheckWalletBalance();
  const [isPending, setIsPending] = useState(false);

  const { userEmail } = useUserStore((state) => ({
    userEmail: state.userEmail,
  }));
  const handleGetBanners = useCallback(async () => {
    try {
      const response = await getBanners.mutateAsync();
      setBanners(response.data.data);
    } catch (error) {
      console.log(error, "Banner api error");
    }
  }, []);

  const handleGetConstantCategories = useCallback(async () => {
    try {
      const response = await getConsultantCategories.mutateAsync();
      setCategoriesList(response.data.data);
    } catch (error) {
      console.log(error, "categories Api error");
      if (error.response.status == 401) {
        clearEmail();
        clearAuth();
        Alert.alert("Unauthorized", "Please login again", [
          {
            text: "Ok",
            onPress: () => {
              router.replace("/");
            },
          },
        ]);
      }
    }
  }, []);

  const handleGetTestimonials = useCallback(async () => {
    try {
      const response = await getTestimonials.mutateAsync();
      setTestimonials(response.data.data);
    } catch (error) {
      console.log(error, "testimonials Api error");
    }
  }, []);
  const handleNavigateConsultantProfile = (name, item) => {
    router.push({
      pathname: "/consultantprofile",
      params: { name: name, consultant: JSON.stringify(item) }, // Add query parameters
    });
  };
  const handleConsultantList = useCallback(async () => {
    try {
      const response = await getConsultantList.mutateAsync(listCategory);

      setConsultantList(response.data.data);
    } catch (error) {
      console.log(error, "Consultant list api error");
    }
  }, [listCategory]);

  const handleSendChatRequest = async (
    email,
    alertTime,
    rechargeTime,
    chatPrice,
    consultantDetails
  ) => {
    const randomRoomNumber = Math.floor(Math.random() * 900) + 100;
    const currentTime = new Date().getTime();
    try {
      const payload = {
        consultant: email,
        type: "Direct",
        user: userEmail,
        conversation_type: "Chat",
      };
      const response = await sendChatRequest.mutateAsync(payload);

      if (response.data.Success) {
        router.push({
          pathname: "/chat",
          params: {
            room: response.data?.data.room_name,
            consultantName: response.data?.data.consultant_first_name,
            consultantImage: response.data?.data.consultant_image,
            consultantEmail: response.data?.data.consultant_email,
            minimumChat: response?.data?.data.minimum_min_chat,
            endAlertTime: alertTime,
            rechargeAlertTime: rechargeTime,
            chatPrice: chatPrice,
            consultantDetails: JSON.stringify(consultantDetails),
          },
        });
      }
    } catch (error) {
      Alert.alert(error.response.data.message);
      console.log(error, "send chat request api error");
    }
  };

  const handleWalletBalanceCheck = async (
    price,
    minutes,
    email,
    alertTime,
    rechargeTime,
    chatPrice,
    consultantDetails
  ) => {
    setIsPending(true);
    try {
      const payload = {
        email: userEmail,
        price: price,
        minutes: minutes,
      };
      const response = await checkWalletBalance.mutateAsync(payload);
      if (response.data.message.status == "success") {
        handleSendChatRequest(
          email,
          alertTime,
          rechargeTime,
          chatPrice,
          consultantDetails
        );
      } else {
        setIsPending(false);
        Alert.alert("You don't have enough balance to chat");
      }
    } catch (error) {
      setIsPending(false);
      console.log("check balance api error", error);
    }
  };

  useEffect(() => {
    handleConsultantList();
  }, [listCategory]);

  useEffect(() => {
    handleGetBanners();
    handleGetConstantCategories();
    handleGetTestimonials();
  }, []);

  const renderCategories = ({ item }) => {
    const isSelected = listCategory === item.name;
    return (
      <TouchableOpacity
        style={
          isSelected
            ? styles.selectedCategoriesMainContainer
            : styles.categoriesMainContainer
        }
        onPress={() => setListCategory(item.name)}
      >
        <View style={styles.categoriesIconContainer}>
          <Image
            source={{ uri: ConstantStrings.url.base_url + item.image }}
            style={styles.icon}
          />
        </View>
        <Text style={styles.categoriesText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderTestimonialList = ({ item }) => {
    return (
      <View style={styles.testimonialCard}>
        <View style={styles.testimonialImageContainer}>
          <Image
            source={{
              uri: ConstantStrings.url.base_url + item.image,
            }}
            style={styles.testimonialImage}
          />
        </View>
        <Text style={styles.testimonialNameText}>{item.testimonial_name}</Text>

        <Text style={styles.testimonialText} numberOfLines={4}>
          {item.description}
        </Text>
      </View>
    );
  };

  const renderConsultants = ({ item }) => {
    let isPending = false;

    const handleChatButtonPress = async () => {
      isPending = true;
      try {
        await handleWalletBalanceCheck(
          item.chat_price,
          item.minimum_min_chat,
          item.email,
          item.end_alert_time,
          item.recharge_alert_time,
          item.chat_price,
          item
        );
      } catch (error) {
        console.error(error);
      } finally {
        isPending = false; // Hide indicator after action is complete
      }
    };
    return (
      <TouchableOpacity
        style={styles.counsellorCard}
        onPress={() => handleNavigateConsultantProfile(item.first_name, item)}
      >
        <View style={styles.consultantActivityContainer}>
          <View style={styles.consultantImageContainer}>
            <Image
              source={{
                uri: ConstantStrings.url.base_url + item.user_image,
              }}
              style={styles.consultantImage}
            />
          </View>
          <View>
            <Entypo
              name="dot-single"
              size={50}
              color={
                item.active_status == "OFFLINE" || item.active_status == "BUSY"
                  ? "#FF4D4D"
                  : "#28a745"
              }
              style={{ position: "absolute", right: -20, bottom: -12 }}
            />
          </View>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.counsellorName}>{item.first_name}</Text>
          <Text style={styles.counsellorDetails}>Years: {item.experience}</Text>
          <Text style={styles.counsellorDetails}>{item.primary_skills}</Text>
        </View>
        <View style={styles.bottomButton}>
          <TouchableOpacity style={styles.button}>
            <>
              <Ionicons name="call" size={16} color="white" />
              <Text style={styles.counsellorRate}>{item.call_price}/min</Text>
            </>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={handleChatButtonPress}
            disabled={checkWalletBalance.isPending}
          >
            {/* <Text style={styles.counsellorRate}>Chat</Text> */}
            {isPending ? (
              <ActivityIndicator color="#fff" size={12} />
            ) : (
              <>
                <Ionicons name="chatbubble" size={16} color="white" />
                <Text style={styles.counsellorRate}>{item.chat_price}/min</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.mainContainer}>
        <View>
          <FlatList
            data={categoriesList}
            renderItem={renderCategories}
            horizontal={true} // Set to horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingBottom: 10 }}
          />
        </View>
        <View style={styles.caroselContainer}>
          <Carousel
            loop
            width={width}
            height={200}
            autoPlay={true}
            autoPlayInterval={3000}
            data={banners}
            scrollAnimationDuration={1000}
            onSnapToItem={(index) => setCurrentIndex(index)}
            renderItem={({ item }) => (
              <Image
                source={{ uri: ConstantStrings.url.base_url + item.image }}
                style={styles.bannerImage}
              />
            )}
          />
          <View style={styles.indicatorContainer}>
            {banners?.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentIndex ? styles.activeIndicator : null,
                ]}
              />
            ))}
          </View>
          {/* <View>
            <FlatList
              data={counsellorsData}
              keyExtractor={(category) => category.type}
              renderItem={renderCategory}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            />
          </View> */}
          <View style={styles.categoryContainer}>
            <View style={styles.categoryTitleContainer}>
              <Text style={styles.categoryTitle}>{listCategory}</Text>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/allconsultants",
                    params: { categoryName: listCategory },
                  })
                }
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={consultantList}
              keyExtractor={(consultants) => consultants.first_name}
              renderItem={renderConsultants}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.counsellorList}
              style={{ paddingVertical: 10 }}
            />
          </View>
          <View style={styles.testimonialContainer}>
            <Text style={styles.testimonialTitle}>Testimonials</Text>
            {/* <FlatList
              data={testimonialsList}
              keyExtractor={(testimonial) => testimonial.type}
              renderItem={renderTestimonialList}
              horizontal
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            /> */}
            <Carousel
              loop
              width={width}
              height={260}
              autoPlay={true}
              autoPlayInterval={3000}
              data={testimonials}
              scrollAnimationDuration={1000}
              onSnapToItem={(index) => setTestimonialCurrentIndex(index)}
              renderItem={renderTestimonialList}
              style={{
                backgroundColor: "#fff",
                paddingVertical: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            />
            <View style={styles.indicatorContainer}>
              {testimonials?.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    index === testimonialCurrentIndex
                      ? styles.activeIndicator
                      : null,
                  ]}
                />
              ))}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mainContainer: {
    paddingVertical: "10%",
    flex: 1,
  },

  categoriesIconContainer: {
    width: 50,
    height: 50,
  },

  icon: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.grey.normal,
  },

  categoriesMainContainer: {
    gap: 10,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
    borderRadius: 16,
    width: 100,
    backgroundColor: "#fff",

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  selectedCategoriesMainContainer: {
    gap: 10,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 16,
    width: 100,
    backgroundColor: "#fff",
    shadowColor: Colors.primary,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  categoriesText: {
    textAlign: "center",
  },

  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  caroselContainer: {
    marginTop: "10%",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: "#000",
    width: 10,
    height: 10,
  },
  counsellorCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 5,
    width: 200,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ccc",
    gap: 6,
  },
  counsellorName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  counsellorDetails: {
    fontSize: 14,
    color: "#555",
  },
  counsellorRate: {
    fontSize: 12,
    color: "#FFF",
    fontWeight: "600",
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
  categoryContainer: {
    gap: 10,
    marginHorizontal: 10,
    paddingVertical: "8%",
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: "3%",
  },
  testimonialTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: "6%",
  },
  counsellorList: {
    paddingHorizontal: 5,
  },

  categoryTitleContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  consultantImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 30,
    borderColor: "#d3d3d3",
    borderWidth: 1,
  },

  consultantImageContainer: {
    width: 60,
    height: 60,
  },
  consultantActivityContainer: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignSelf: "center",
  },
  testimonialImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 35,
    borderColor: "#d3d3d3",
    borderWidth: 1,
  },
  testimonialImageContainer: {
    width: 70,
    height: 70,
    shadowColor: "#4d93cc",
    shadowOpacity: 0.7,
    shadowOffset: { width: 1, height: 0 },
    shadowRadius: 10,
    elevation: 3,
  },

  testimonialCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    paddingVertical: "4%",
    paddingHorizontal: "6%",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 6,
    marginTop: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginHorizontal: 16,
    minHeight: 200,
    alignSelf: "center",
  },
  testimonialContainer: {
    marginBottom: 30,
  },
  testimonialNameText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  testimonialText: {
    fontSize: 14,
    textAlign: "center",
  },
  detailsContainer: {
    gap: 3,
    alignItems: "center",
  },
  bottomButton: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    backgroundColor: Colors.primary,
    color: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
    gap: 3,
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default Home;
