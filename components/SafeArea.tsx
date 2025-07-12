import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  StatusBar, 
  Platform,
  Dimensions,
  ViewStyle
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 1. Safe Area Context
interface SafeAreaContextType {
  insets: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  screenData: {
    width: number;
    height: number;
    hasNotch: boolean;
    hasHomeIndicator: boolean;
  };
}

const SafeAreaContext = createContext<SafeAreaContextType>({
  insets: { top: 0, bottom: 0, left: 0, right: 0 },
  screenData: {
    width: 0,
    height: 0,
    hasNotch: false,
    hasHomeIndicator: false
  }
});

// 2. SafeProvider Component
interface SafeProviderProps {
  children: React.ReactNode;
}

export const SafeProvider: React.FC<SafeProviderProps> = ({ children }) => {
  const insets = useSafeAreaInsets();
  const [screenData, setScreenData] = useState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    hasNotch: insets.top > 20,
    hasHomeIndicator: insets.bottom > 0
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData(prev => ({
        ...prev,
        width: window.width,
        height: window.height
      }));
    });

    return () => subscription?.remove();
  }, []);

  const value = {
    insets,
    screenData
  };

  return (
    <SafeAreaContext.Provider value={value}>
      {children}
    </SafeAreaContext.Provider>
  );
};

// 3. useSafeArea Hook
export const useSafeArea = () => {
  const context = useContext(SafeAreaContext);
  if (!context) {
    throw new Error('useSafeArea must be used within SafeProvider');
  }
  return context;
};

// 4. SafeArea Component với nhiều options
interface SafeAreaProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  backgroundColor?: string;
  statusBarStyle?: 'default' | 'light-content' | 'dark-content';
  statusBarBackgroundColor?: string;
  forceInset?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  mode?: 'padding' | 'margin';
}

export const SafeArea: React.FC<SafeAreaProps> = ({ 
  children, 
  style,
  edges = ['top', 'bottom', 'left', 'right'],
  backgroundColor = '#ffffff',
  statusBarStyle = 'dark-content',
  statusBarBackgroundColor,
  forceInset,
  mode = 'padding'
}) => {
  const { insets } = useSafeArea();

  // Tính toán insets dựa trên edges được chỉ định
  const safeInsets: ViewStyle = {
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
    paddingLeft: edges.includes('left') ? insets.left : 0,
    paddingRight: edges.includes('right') ? insets.right : 0,
  };

  // Nếu sử dụng margin thay vì padding
  if (mode === 'margin') {
    safeInsets.marginTop = safeInsets.paddingTop;
    safeInsets.marginBottom = safeInsets.paddingBottom;
    safeInsets.marginLeft = safeInsets.paddingLeft;
    safeInsets.marginRight = safeInsets.paddingRight;
    
    delete safeInsets.paddingTop;
    delete safeInsets.paddingBottom;
    delete safeInsets.paddingLeft;
    delete safeInsets.paddingRight;
  }

  // Override với forceInset nếu được cung cấp
  if (forceInset) {
    Object.keys(forceInset).forEach(key => {
      const paddingKey = mode === 'padding' ? 
        `padding${key.charAt(0).toUpperCase() + key.slice(1)}` : 
        `margin${key.charAt(0).toUpperCase() + key.slice(1)}`;
      (safeInsets as any)[paddingKey] = forceInset[key as keyof typeof forceInset];
    });
  }

  return (
    <View style={[styles.safeArea, { backgroundColor }, safeInsets, style]}>
      <StatusBar 
        barStyle={statusBarStyle}
        backgroundColor={statusBarBackgroundColor || backgroundColor}
        translucent={Platform.OS === 'android'}
      />
      {children}
    </View>
  );
};

// 5. SafeAreaView Component (alternative approach)
interface SafeAreaViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  [key: string]: any;
}

export const SafeAreaView: React.FC<SafeAreaViewProps> = ({ children, style, ...props }) => {
  const { insets } = useSafeArea();
  
  return (
    <View 
      style={[
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        style
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

// 6. Conditional SafeArea Components
interface SafeAreaEdgeProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const SafeAreaTop: React.FC<SafeAreaEdgeProps> = ({ children, style }) => {
  const { insets } = useSafeArea();
  return (
    <View style={[{ paddingTop: insets.top }, style]}>
      {children}
    </View>
  );
};

export const SafeAreaBottom: React.FC<SafeAreaEdgeProps> = ({ children, style }) => {
  const { insets } = useSafeArea();
  return (
    <View style={[{ paddingBottom: insets.bottom }, style]}>
      {children}
    </View>
  );
};

export const SafeAreaLeft: React.FC<SafeAreaEdgeProps> = ({ children, style }) => {
  const { insets } = useSafeArea();
  return (
    <View style={[{ paddingLeft: insets.left }, style]}>
      {children}
    </View>
  );
};

export const SafeAreaRight: React.FC<SafeAreaEdgeProps> = ({ children, style }) => {
  const { insets } = useSafeArea();
  return (
    <View style={[{ paddingRight: insets.right }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
