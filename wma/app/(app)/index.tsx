import { ThemedText } from "@/components/ThemedText";
import { useSession } from "@/providers/auth-context";
import { ScrollView, Text } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

function useUser() {
  const { user } = useSession();
  return user!;
}

export default function HomeScreen() {
  const user = useUser();

  return (
    <SafeAreaView>
      <ScrollView>
        <ThemedText className="text-4xl flex flex-row gap-2">
          Hello
          <Text className="text-Colors-primary font-bold pl-2">
            {user.fullName}
          </Text>
        </ThemedText>
      </ScrollView>
    </SafeAreaView>
  );
}
