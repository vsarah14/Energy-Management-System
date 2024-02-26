package com.example.devicesimulator.configuration;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration //indicates that this class provides bean definitions
public class MQConfigSimulator {
    public static final String queueName = "message_queue";
    public static final String topicExchangeName = "message_exchange";
    public static final String routingKey = "message_key";

    //declares a bean for the message queue
    @Bean
    public Queue simulatorQueue() {
        return new Queue(queueName);
    }

    //declare a bean for the topic exchange
    @Bean
    public TopicExchange simulatorExchange() {
        return new TopicExchange(topicExchangeName);
    }

    //declares a bean for the binding between the queue and exchange
    @Bean
    public Binding simulatorBinding(Queue queue, TopicExchange topicExchange) {
        return BindingBuilder.bind(queue).to(topicExchange).with(routingKey);
    }

    //JSON message serialization/deserialization
    @Bean
    public MessageConverter simulatorMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    //declares a bean used for sending messages
    @Bean
    public AmqpTemplate simulatorTemplate(ConnectionFactory connectionFactory, MessageConverter messageConverter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter);
        return template;
    }

    //declares a bean used for receiving messages
    @Bean
    public SimpleRabbitListenerContainerFactory simulatorListenerFactory(ConnectionFactory connectionFactory, MessageConverter messageConverter) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(messageConverter);
        return factory;
    }
}