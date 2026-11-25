import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

export async function hapticTap(): Promise<void> {
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    // Web browser fallback: silent
  }
}

export async function hapticSuccess(): Promise<void> {
  try {
    await Haptics.notification({ type: NotificationType.Success });
  } catch {
    // Web browser fallback
  }
}

export async function hapticError(): Promise<void> {
  try {
    await Haptics.notification({ type: NotificationType.Error });
  } catch {
    // Web browser fallback
  }
}
