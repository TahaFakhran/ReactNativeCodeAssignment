import { StyleSheet, Text, View, SafeAreaView, FlatList, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import React, { useLayoutEffect, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { SearchBar } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';

const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
};

const Dashboard = ({ navigation }) => {

    const [refreshing, setRefreshing] = React.useState(false);
    const [isLoading, setLoading] = useState(true);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getArticles();
        wait(2000).then(() => setRefreshing(false));
    }, []);

    const [key, onChangeKey] = useState('accessToken');


    const logout = async () => {
        await SecureStore.setItemAsync(key, '');
        navigation.replace('Login');
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTintColor: "white",
            headerStyle: {
                backgroundColor: '#2193b0'
            },
            headerLeft: () => (
                <View />
            ),
            headerRight: () => (
                <View style={{ marginRight: 20 }}>
                    <Text style={{ fontSize: 16, marginLeft: 5, color: '#ffafbd' }} onPress={logout} > Logout</Text>
                </View>
            ),
        });
    }, [navigation]);

    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);

    useEffect(() => {
        getArticles();
    }, []);

    const getArticles = async () => {
        try {
            fetch('https://newsapi.org/v2/everything?q=tesla&from=2022-03-30&sortBy=publishedAt&apiKey=b641d134e6444e20a96b2bb2209021c6')
                .then((response) => response.json())
                .then((responseJson) => {
                    const newData = responseJson.articles.map((data) => ({
                        title: data.title,
                    }));

                    setFilteredDataSource(newData);
                    setMasterDataSource(newData)
                })
                .catch((error) => {
                    console.error(error);
                })
        } catch (error) {
            alert(error);
        } finally {
            setLoading(false);
        }
    }

    const searchFilterFunction = (text) => {
        if (text) {
            const newData = masterDataSource.filter(function (item) {
                const itemData = item.title
                    ? item.title.toUpperCase()
                    : ''.toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            setFilteredDataSource(newData);
            setSearch(text);
        } else {
            setFilteredDataSource(masterDataSource);
            setSearch(text);
        }
    };

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const ItemView = ({ item }) => {


        return (
            // Flat List Item
            <Text style={styles.itemStyle} onPress={() => getItem(item)}>
                {capitalizeFirstLetter(item.title)}
            </Text>
        );
    };

    const ItemSeparatorView = () => {
        return (
            // Flat List Item Separator
            <View
                style={{
                    height: 0.5,
                    width: '100%',
                    backgroundColor: '#C8C8C8',
                    borderStyle: 'dotted',
                    borderWidth: 1,
                    borderColor: '#2193b0'
                }}
            />
        );
    };

    const getItem = (item) => {
        // Function for click on an item
        Alert.alert("Article", (capitalizeFirstLetter(item.title)));;
    };


    return (
        < >
            {isLoading ? <ActivityIndicator /> : (
                <SafeAreaView style={{ flex: 1 }}>

                    <View style={styles.container}>
                        <LinearGradient
                            // Background Linear Gradient
                            colors={['#ffafbd', '#ffc3a0']}
                            style={styles.background}
                        >
                            <SearchBar
                                round
                                searchIcon={{ size: 24 }}
                                onChangeText={(text) => searchFilterFunction(text)}
                                onClear={(text) => searchFilterFunction('')}
                                placeholder="Type Here..."
                                value={search}
                            />

                            <FlatList
                                data={filteredDataSource}
                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                                keyExtractor={(item, index) => index.toString()}
                                ItemSeparatorComponent={ItemSeparatorView}
                                renderItem={ItemView}
                            />
                        </LinearGradient>
                    </View>

                    <ActivityIndicator size="large" color="#2193b0" animating={true} />

                </SafeAreaView>
            )}
        </>

    );

}

export default Dashboard;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    itemStyle: {
        padding: 10,
    },
});