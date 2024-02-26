package com.example.devicemonitoring.configuration;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MQConfigSimulator {
    public static final String queueName = "message_queue";
    public static final String topicExchangeName = "message_exchange";
    public static final String routingKey = "message_key";

    @Bean
    public Queue simulatorQueue() {
        return new Queue(queueName);
    }

    @Bean
    public TopicExchange simulatorExchange() {
        return new TopicExchange(topicExchangeName);
    }

    @Bean
    public Binding simulatorBinding(@Qualifier("simulatorQueue") Queue queue, @Qualifier("simulatorExchange") TopicExchange topicExchange) {
        return BindingBuilder.bind(queue).to(topicExchange).with(routingKey);
    }

    @Bean
    public MessageConverter simulatorMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public AmqpTemplate simulatorTemplate(ConnectionFactory connectionFactory, @Qualifier("simulatorMessageConverter") MessageConverter messageConverter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter);
        return template;
    }

    @Bean
    public SimpleRabbitListenerContainerFactory simulatorListenerFactory(ConnectionFactory connectionFactory, @Qualifier("simulatorMessageConverter") MessageConverter messageConverter) {
        SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
        factory.setConnectionFactory(connectionFactory);
        factory.setMessageConverter(messageConverter);
        return factory;
    }
}
