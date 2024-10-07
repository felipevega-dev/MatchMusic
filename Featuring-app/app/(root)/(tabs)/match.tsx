import React, { useRef, useState } from 'react';
import { View, Text, Image, Animated, PanResponder, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const SWIPE_THRESHOLD = 120;

interface CardProps {
  card: {
    id: number;
    name: string;
    bio: string;
    image: string;
    ubication: string;
    distancia: string;
    habilidades: string[];
  };
  isFirst?: boolean;
  [key: string]: any;
}

const Card: React.FC<CardProps> = ({ card, isFirst, ...rest }) => {
  return (
    <Animated.View
      className={`absolute w-[85%] justify-start items-center h-[85%] bg-white rounded-xl shadow-lg ${
        isFirst ? 'z-10' : ''
      } top-10`}
      {...rest}
    >
      <Image
        source={{ uri: card.image }}
        className="w-[75%] mt-5 h-2/4 rounded-t-xl" // Ajustamos el tamaño de la imagen
      />
      <View className="p-4 w-full justify-center items-center ">
      <TouchableOpacity className="bg-blue-500 rounded-full absolute m-20 top-10 transform p-2 w-1/2">
          <Text className="text-white font-bold text-center">Ver Perfil</Text>
      </TouchableOpacity>
        <Text className="text-xl text-center font-bold">{card.name}</Text>
        <View className="flex-row justify-center items-center mt-1">
          <Text className="text-gray-500 font-bold">{card.ubication}</Text>
          <Text className="text-gray-500 font-bold mx-2">•</Text>
          <Text className="font-bold">{card.distancia}</Text>
        </View>
        <View className="flex-row flex-wrap justify-center mt-2">
          {card.habilidades.map((habilidad, index) => (
            <Text key={index} className="text-sm font-semibold bg-gray-200 rounded-full px-2 py-1 m-1">
              {habilidad}
            </Text>
          ))}
        </View>
        
      </View>
    </Animated.View>
  );
};

const Match = () => {
  const initialCards = [
    { id: 1, name: 'Usuario 1', bio: 'Bio 1', image: 'https://picsum.photos/200/300', ubication: 'Ubicación 1', distancia: '10km', habilidades: ['Cantante', 'Guitarrista', 'Productor']},
    { id: 2, name: 'Usuario 2', bio: 'Bio 2', image: 'https://picsum.photos/200/301', ubication: 'Ubicación 2', distancia: '20km', habilidades: ['Habilidad 4', 'Habilidad 5', 'Habilidad 6']},
    { id: 3, name: 'Usuario 3', bio: 'Bio 3', image: 'https://picsum.photos/200/302', ubication: 'Ubicación 3', distancia: '30km', habilidades: ['Habilidad 7', 'Habilidad 8', 'Habilidad 9']},
  ];

  const [cards, setCards] = useState(initialCards);

  const position = useRef(new Animated.ValueXY()).current;
  const rotate = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, 0, SWIPE_THRESHOLD],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (_, gesture) => {
      if (Math.abs(gesture.dx) > SWIPE_THRESHOLD) {
        Animated.spring(position, {
          toValue: { x: gesture.dx * 5, y: gesture.dy },
          useNativeDriver: false,
        }).start(() => {
          setCards((prevCards) => prevCards.slice(1));
          position.setValue({ x: 0, y: 0 });
        });
      } else {
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          friction: 4,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const renderCards = () => {
    return cards.map((card, index) => {
      if (index === 0) {
        return (
          <Card
            key={card.id}
            card={card}
            isFirst={true}
            {...panResponder.panHandlers}
            style={{
              transform: [
                { translateX: position.x },
                { translateY: position.y },
                { rotate: rotate },
              ],
            }}
          />
        );
      }
      return <Card key={card.id} card={card} isFirst={false} />;
    }).reverse();
  };

  const refreshCards = () => {
    setCards(initialCards);
    position.setValue({ x: 0, y: 0 });
  };

  return (
    <GestureHandlerRootView className="flex-1 ">
      <View className="flex-1 items-center justify-center bg-gray-100">
        {renderCards()}
        <TouchableOpacity
          onPress={refreshCards}
          className="absolute top-10 right-5 bg-blue-500 py-2 px-4 rounded-full"
        >
          <Text className="text-white font-bold">Refrescar</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
};

export default Match;