import React from "react"
import {Text, View, ViewStyle, Button} from "react-native"
import {RootStoreContext} from "../models/root-store/root-store-context";

const FULL: ViewStyle = {flex: 1, padding: 40}

export class HomeScreen extends React.Component<any, any> {

    static contextType = RootStoreContext

    async componentDidMount() {
        const rootStore = this.context
        await rootStore.loadActiveUser()
    }

    render() {
        return (
            <View style={FULL}>
                <Text>Hello</Text>
                <Button title="Button Stops working if flow wraps" onPress={() => console.log("still working")}/>
            </View>
        )
    }
}
