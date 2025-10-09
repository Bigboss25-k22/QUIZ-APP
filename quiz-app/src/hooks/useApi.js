import { useState, useCallback } from "react";

/**
 * useApi - custom hook để gọi API và quản lý loading, error, data
 * @param {function} apiFunc - Hàm gọi API trả về promise
 * @returns {object} { data, error, loading, callApi }
 */
export function useApi(apiFunc) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const callApi = useCallback(async (...args) => {
        setLoading(true);
        setError(null);
        try {
            const result = await apiFunc(...args);
            setData(result);
            return result;
        } catch (err) {
            setError(err.message || "Có lỗi xảy ra");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [apiFunc]);

    return { data, error, loading, callApi };
}
