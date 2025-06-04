package com.ofss.ecc;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class CustomerStatusServlet extends HttpServlet {

	private static final long serialVersionUID = 1L;

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		String url = "jdbc:oracle:thin:@10.170.2.21:1521:testdb";
		String username = "pbltest";
		String password = "pbltest";

		String customerNumber = request.getParameter("customerNumber");

		response.setContentType("text/html");
		PrintWriter writer = response.getWriter();

		if (customerNumber.isEmpty()) {
			writer.println("customer Number is missing...");   //CHECKING PURPOSE
			return;
		}

		try {
			Class.forName("oracle.jdbc.driver.OracleDriver");
			Connection connection = DriverManager.getConnection(url, username, password);

			PreparedStatement preparedStatement = connection.prepareStatement(
					"SELECT ACCOUNT_STATUS FROM cltb_account_apps_master WHERE user_defined_status <> 'NORM' AND customer_id = ? AND account_status = 'A'");
			preparedStatement.setString(1, customerNumber);
			ResultSet resultSet = preparedStatement.executeQuery();

			if (resultSet.next()) {
				writer.println("alert('Refer to SAM !!');");
			} else {
				writer.println("It's a NORM account");  //CHECKING PURPOSE
			}

		} catch (ClassNotFoundException | SQLException e) {
			e.printStackTrace();
			writer.println("Error: Error occurred");   //CHECKING PURPOSE
		}

	}
}
