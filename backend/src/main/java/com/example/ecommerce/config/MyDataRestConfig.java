package com.example.ecommerce.config;

import com.example.ecommerce.entity.Country;
import com.example.ecommerce.entity.State;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.entity.ProductCategory;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    @Value("${allowed.origins}")
    private String[] theAllowedOrigins;

    private EntityManager entityManager;

    // Enables Entity in the backend
    @Autowired
    public MyDataRestConfig(EntityManager theEntityManager){
        entityManager = theEntityManager;
    }


    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config,
                                                     CorsRegistry cors) {
        
        HttpMethod[] theUnsupportedActions = { HttpMethod.PUT, HttpMethod.DELETE, HttpMethod.POST, HttpMethod.PATCH };

        // disable HTTP Methods for Product: PUT, POST and DELETE
        disableHttpMethods(Product.class, config, theUnsupportedActions);

        // disable HTTP Methods for ProductCategory: PUT, POST and DELETE
        disableHttpMethods(ProductCategory.class, config, theUnsupportedActions);

        // disable HTTP Methods for Country: PUT, POST and DELETE
        disableHttpMethods(Country.class, config, theUnsupportedActions);

        // disable HTTP Methods for State: PUT, POST and DELETE
        disableHttpMethods(State.class, config, theUnsupportedActions);


        // call an internal helper method
        exposeIds(config);

        // configure cors mapping
        cors.addMapping(config.getBasePath() + "/**").allowedOrigins(theAllowedOrigins);
    }

    private void disableHttpMethods(Class theClass,RepositoryRestConfiguration config,
                                    HttpMethod[] theUnsupportedActions) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure((metadata, httpMethod) -> httpMethod.disable(theUnsupportedActions))
                .withCollectionExposure((metadata, httpMethod) -> httpMethod.disable(theUnsupportedActions));
    }


    private void exposeIds(RepositoryRestConfiguration config){
        // expose entity ids
        //

        // -get a list of all entity classes from the entity manager
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        // - create an array of the entity types [empty]
        List<Class> entityClasses = new ArrayList<>();

        // - get the entity types for the entities [populate]
        for(EntityType tempEntityType: entities){
            entityClasses.add(tempEntityType.getJavaType());
        }


        // - expose the entity ids for the array of entity/domain types
        Class[] domainTypes = entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);
    }

}
