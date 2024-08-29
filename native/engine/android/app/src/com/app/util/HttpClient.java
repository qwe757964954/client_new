package com.app.util;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

public class HttpClient {
    public static String sendPostRequest(String url, String postData) {
        HttpURLConnection connection = null;

        try {
            // 创建URL对象
            URL apiUrl = new URL(url);

            // 打开连接
            connection = (HttpURLConnection) apiUrl.openConnection();

            // 设置请求方法为POST
            connection.setRequestMethod("POST");

            // 启用输入输出
            connection.setDoOutput(true);

            // 设置请求头
            connection.setRequestProperty("Content-Type", "application/json");
            connection.setRequestProperty("charset", "utf-8");

            // 获取输出流并写入POST数据
            try (DataOutputStream wr = new DataOutputStream(connection.getOutputStream())) {
                byte[] postDataBytes = postData.getBytes(StandardCharsets.UTF_8);
                wr.write(postDataBytes);
            }

            // 获取响应代码
            int responseCode = connection.getResponseCode();

            // 读取响应内容
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(
                    (responseCode == HttpURLConnection.HTTP_OK) ? connection.getInputStream() : connection.getErrorStream()))) {
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                return response.toString();
            }

        } catch (IOException e) {
//            e.printStackTrace();
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
        return "";
    }

    public static String sendGeRequest(String url) {
        HttpURLConnection connection = null;

        try {
            // 创建URL对象
            URL apiUrl = new URL(url);

            // 打开连接
            connection = (HttpURLConnection) apiUrl.openConnection();

            // 设置请求方法为POST
            connection.setRequestMethod("GET");

            // 启用输入输出
            connection.setDoOutput(true);

            // 设置请求头
//            connection.setRequestProperty("Content-Type", "application/json");
//            connection.setRequestProperty("charset", "utf-8");

            // 获取响应代码
            int responseCode = connection.getResponseCode();

            // 读取响应内容
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(
                    (responseCode == HttpURLConnection.HTTP_OK) ? connection.getInputStream() : connection.getErrorStream()))) {
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    response.append(line);
                }
                return response.toString();
            }

        } catch (IOException e) {
//            e.printStackTrace();
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
        return "";
    }
}
