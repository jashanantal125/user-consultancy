import { NavigationContainer } from '@react-navigation/native';
import { Text, StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import BlogViewDetails from '../../components/blog';
import useStore from '../store';

export default function BlogDetails({ route }) {
  const [blogDetail, setBlogDetail] = useState(null);
  const { blogName } = route.params;
  const sid = useStore((state) => state.sid);

  useEffect(() => {
    getBlogDetails();
  }, []);

  const getBlogDetails = async () => {
    try {
      const res = await fetch(`http://65.0.52.105:8006/api/resource/blog%20screen?filters=[["blog_title", "=", "${blogName}"]]&fields=["*"]&sid=${sid}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: "same-origin",
      });
      const data = await res.json();
    //   console.log(data.data)
      setBlogDetail(data.data[0]); // Assuming the response contains an array of matching products
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  if (!blogDetail) {
    return <ActivityIndicator size="large" color="#FF1D58" />;
  }

  return (
    <View>
      <BlogViewDetails blogContent={blogDetail} />
    </View>
  );
}