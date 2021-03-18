# Prerequisites

## Database
```
docker run -d \
    --name sequelize-training \
    -e POSTGRES_PASSWORD=mysecretpassword \
    -e POSTGRES_USER=lalilo \
    -e POSTGRES_DB=sequelize \
    -p 5432:5432
    postgres
```

# Models

### Student
- name
- age

Students have multiple teachers

### Teacher
- name

Teacher have multiple students
A teacher has only one school

### School
- name

Schools have multiple teachers


# Steps

1. Create a sequelize instance
2. Connect to a database by using the information above
3. Create a migration to add a table - student & teacher & school
4. Create both student and teacher models
5. Create a seed to insert data
6. Write a function that returns all the students from teacher with id x
7. Write a function that returns the students and teachers from a school with id x
8. Write a inserts a student linked to teacher with id x
