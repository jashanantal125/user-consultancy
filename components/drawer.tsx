import { Drawer } from 'expo-router/drawer';

export default function ExpoDrawer() {
    return(
        
      <Drawer >
        <Drawer.Screen
          name="home" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Home',
            headerTitle: 'home'
          }}
        />
         <Drawer.Screen
          name="chat" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Chat',
            headerTitle: 'Chat'
          }}
        />
      </Drawer>
    
    )
}