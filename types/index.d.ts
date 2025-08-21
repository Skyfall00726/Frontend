declare module 'react-native-deck-swiper' {
  import { Component } from 'react';
  import { ViewStyle, TextStyle } from 'react-native';

  interface SwiperProps<T> {
    cards: T[];
    renderCard: (card: T) => JSX.Element | null;
    onSwipedLeft?: (cardIndex: number) => void;
    onSwipedRight?: (cardIndex: number) => void;
    onSwipedAll?: () => void;
    onSwiped?: (cardIndex: number) => void;
    cardIndex?: number;
    backgroundColor?: string;
    stackSize?: number;
    stackSeparation?: number;
    animateOverlayLabelsOpacity?: boolean;
    animateCardOpacity?: boolean;
    swipeBackCard?: boolean;
    overlayLabels?: {
      left?: {
        title: string;
        style: {
          label: ViewStyle & TextStyle;
          wrapper: ViewStyle;
        };
      };
      right?: {
        title: string;
        style: {
          label: ViewStyle & TextStyle;
          wrapper: ViewStyle;
        };
      };
    };
    children?: React.ReactNode;
  }

  export default class Swiper<T> extends Component<SwiperProps<T>> {
    swipeLeft(): void;
    swipeRight(): void;
  }
}
