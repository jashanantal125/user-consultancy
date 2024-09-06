import { homeStyles } from "@/app/home/home";
import { View, Text } from "react-native";

const IconWithText = ({ icon, text }: { icon: any, text: string }) => (
    <View style={homeStyles.iconTextContainer}>
        <IconButton
            icon={icon}
            iconColor='white'
            mode='outlined'
            size={60}
            containerStyle={homeStyles.iconButton}
        />
        <Text style={homeStyles.iconText}>{text}</Text>
    </View>
);