import { useSelector } from 'react-redux'; 
import { View, FlatList, Text } from'react-native'; 
import { Avatar, ListItem } from 'react-native-elements';
import Loading from '../components/LoadingComponent'; 
import { baseUrl } from '../shared/baseUrl'; 

const FavoriteScreen = ({ navigation }) => {
    const { campsiteArray, isLoading, errMess } = useSelector((state) => state.campsites);
    const favorite = useSelector((state) => state.favorites); 

    const renderFavoriteItem = ({ item: campsite }) => {
        return (
            <ListItem
                onPress={() => navigation.navigate('Directory', {
                    screen: 'CampsiteInfo',
                    params: 'CampsiteInfo',

                    })
               }
            >
            <Avatar rounded source={{ uri: baseUrl + campsite.image }} />
            <ListItem.Content> 
                <ListItem.Title> {campsite.name}</ListItem.Title>
                <ListItem.Subtitle> 
                    {campsite.description} 
                    
                </ListItem.Subtitle>
            </ListItem.Content>
            </ListItem>

        );
    }

    if (isLoading) {
        return <Loading />;
    } 
    if (errMess) {
        return (
            <View>
                <Text>{errMess}</Text>
            </View>
        );
    } 
    return (
        <FlatList 
            data={campsiteArray.filter(campsite => 
                favorite.includes(campsite.id)
            )} 
            renderItem={renderFavoriteItem} 
            keyExtractor={(item) => item.id.toString()}
        />
    );

};

export default FavoriteScreen; 

