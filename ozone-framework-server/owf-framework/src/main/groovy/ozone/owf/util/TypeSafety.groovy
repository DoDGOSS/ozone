package ozone.owf.util

import javax.annotation.Nullable

import static java.util.Collections.emptyList
import static java.util.Collections.emptyMap


abstract class TypeSafety {

    static Map asMap(Object obj) {
        return (obj != null && obj instanceof Map) ? obj : emptyMap()
    }

    static List asList(Object obj) {
        return (obj != null && obj instanceof List) ? obj : emptyList()
    }

    static int asInt(Object obj, int defaultValue = 0) {
        return (obj != null && obj instanceof Integer) ? obj : defaultValue
    }

    static @Nullable Long asLong(Object obj) {
        if (obj instanceof Long) return obj
        if (obj instanceof Number) return obj.longValue()
        if (obj instanceof String) return parseLong(obj)
        return null
    }

    static @Nullable Long parseLong(String value) {
        try {
            return Long.parseLong(value)
        }
        catch (NumberFormatException ignored) {
            return null
        }
    }

}
