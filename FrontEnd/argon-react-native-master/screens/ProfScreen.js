import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  AsyncStorage,
} from "react-native";
import { ListItem, SearchBar } from "react-native-elements";
import { Block, Text, theme } from "galio-framework";
import { Images, argonTheme } from "../constants";
const { width, height } = Dimensions.get("screen");
import { FetchRequest } from "../functions/API/FetchRequest";
import _ from "lodash";

class ProfScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      //foods which are appearing on the search screen temp
      data: [],
      filteredData: [],
      error: null,
      searchTerm: "",
      value: "",
      clientData: [],
    };
  }

  async componentDidMount() {
    try {
      const token = await AsyncStorage.getItem("userToken");
      let usersRequest = new FetchRequest("GET", "/pro", token);
      let response = await usersRequest.request();
      if (response.ok) {
        let data = await response.json();
        console.log(data);
        this.setState({
          data: data,
          filteredData: data
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  //   fetch("https://jsonplaceholder.typicode.com/users")
  //     .then((response) => response.json())
  //     .then((responseJson) => {
  //       this.setState({
  //         loading: false,
  //         data: responseJson,
  //         filteredData: responseJson,
  //       });
  //     })
  //     .catch((error) => console.log(error)); //to catch the errors if any
  // }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%",
        }}
      />
    );
  };

  searchFilterFunction = (text) => {
    const search = text.toLowerCase();
    this.setState({
      value: search,
      filteredData: this.state.data.filter((item) =>
        item.email.toString().toLowerCase().includes(search)
      ),
    });
  };

  renderHeader = () => {
    return (
      <SearchBar
        lightTheme
        round
        placeholder="Type to search users..."
        value={this.state.value}
        onChangeText={(text) => this.searchFilterFunction(text)} // function to capture the text
      />
    );
  };

  onPress(id, email) {
    const navigation = this.props.navigation;
    navigation.push("Viewprofile", {
      id: id,
      email: email,
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator />
        </View>
      );
    } else {
      return (
        <Block flex>
          <Block>
            <Text style={{ textAlign: "center", fontSize: 25 }}>Welcome</Text>
          </Block>
          <ImageBackground
            source={Images.ProfileBackground}
            style={styles.bgContainer}
            imageStyle={styles.Background}
          >
            <ScrollView>
              <Block flex>
                <View style={styles.container}>
                  <FlatList
                    keyExtractor={(item) => item.userID.toString()}
                    data={this.state.filteredData}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() =>
                          this.onPress(
                            item.userID.toString(),
                            item.email.toString()
                          )
                        }
                      >
                        <ListItem
                          title={item.firstName + " " + item.lastName}
                          subtitle={item.email}
                        />
                      </TouchableOpacity>
                      //<Text style={styles.lightText, { fontSize: 20 }}>{item.name} {item.email}</Text>
                    )}
                    extraData={this.state}
                    ItemSeparatorComponent={this.renderSeparator}
                    ListHeaderComponent={this.renderHeader}
                  />
                </View>
              </Block>
            </ScrollView>
          </ImageBackground>
        </Block>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1,
  },
  Background: {
    width: width,
    height: height / 2,
  },
});
export default ProfScreen;
