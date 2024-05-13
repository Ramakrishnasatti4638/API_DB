PGDMP              
        |            MedicalStore    16.2    16.2     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16569    MedicalStore    DATABASE     �   CREATE DATABASE "MedicalStore" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE "MedicalStore";
                postgres    false            �            1259    16592 	   medicines    TABLE     �   CREATE TABLE public.medicines (
    "MedicineID" integer NOT NULL,
    "MedicineName" character varying(50) NOT NULL,
    "MedicinePrice" numeric(10,2) NOT NULL,
    "MedicineCount" integer NOT NULL,
    "MedicineExpiry" date NOT NULL
);
    DROP TABLE public.medicines;
       public         heap    postgres    false            �            1259    16591    medicines_MedicineID_seq    SEQUENCE     �   CREATE SEQUENCE public."medicines_MedicineID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public."medicines_MedicineID_seq";
       public          postgres    false    218            �           0    0    medicines_MedicineID_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public."medicines_MedicineID_seq" OWNED BY public.medicines."MedicineID";
          public          postgres    false    217            �            1259    16606    orders    TABLE       CREATE TABLE public.orders (
    "OrderID" integer NOT NULL,
    "MedicineID" integer NOT NULL,
    "UserID" integer NOT NULL,
    "MedicineName" character varying(25) NOT NULL,
    "MedicineCount" integer NOT NULL,
    "OrderStatusCancel" character varying(20) NOT NULL
);
    DROP TABLE public.orders;
       public         heap    postgres    false            �            1259    16605    orders_OrderID_seq    SEQUENCE     �   CREATE SEQUENCE public."orders_OrderID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public."orders_OrderID_seq";
       public          postgres    false    220            �           0    0    orders_OrderID_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public."orders_OrderID_seq" OWNED BY public.orders."OrderID";
          public          postgres    false    219            �            1259    16585    users    TABLE     �   CREATE TABLE public.users (
    "UserID" integer NOT NULL,
    "Name" character varying(50) NOT NULL,
    "UserName" character varying(50) NOT NULL,
    "UserPassword" character varying(50) NOT NULL,
    "UserBalance" numeric(10,2)
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    16584    users_UserID_seq    SEQUENCE     �   CREATE SEQUENCE public."users_UserID_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public."users_UserID_seq";
       public          postgres    false    216                        0    0    users_UserID_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public."users_UserID_seq" OWNED BY public.users."UserID";
          public          postgres    false    215            [           2604    16595    medicines MedicineID    DEFAULT     �   ALTER TABLE ONLY public.medicines ALTER COLUMN "MedicineID" SET DEFAULT nextval('public."medicines_MedicineID_seq"'::regclass);
 E   ALTER TABLE public.medicines ALTER COLUMN "MedicineID" DROP DEFAULT;
       public          postgres    false    218    217    218            \           2604    16609    orders OrderID    DEFAULT     t   ALTER TABLE ONLY public.orders ALTER COLUMN "OrderID" SET DEFAULT nextval('public."orders_OrderID_seq"'::regclass);
 ?   ALTER TABLE public.orders ALTER COLUMN "OrderID" DROP DEFAULT;
       public          postgres    false    219    220    220            Z           2604    16588    users UserID    DEFAULT     p   ALTER TABLE ONLY public.users ALTER COLUMN "UserID" SET DEFAULT nextval('public."users_UserID_seq"'::regclass);
 =   ALTER TABLE public.users ALTER COLUMN "UserID" DROP DEFAULT;
       public          postgres    false    215    216    216            �          0    16592 	   medicines 
   TABLE DATA           u   COPY public.medicines ("MedicineID", "MedicineName", "MedicinePrice", "MedicineCount", "MedicineExpiry") FROM stdin;
    public          postgres    false    218   �       �          0    16606    orders 
   TABLE DATA           y   COPY public.orders ("OrderID", "MedicineID", "UserID", "MedicineName", "MedicineCount", "OrderStatusCancel") FROM stdin;
    public          postgres    false    220   j       �          0    16585    users 
   TABLE DATA           \   COPY public.users ("UserID", "Name", "UserName", "UserPassword", "UserBalance") FROM stdin;
    public          postgres    false    216   �                  0    0    medicines_MedicineID_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('public."medicines_MedicineID_seq"', 12, true);
          public          postgres    false    217                       0    0    orders_OrderID_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."orders_OrderID_seq"', 26, true);
          public          postgres    false    219                       0    0    users_UserID_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public."users_UserID_seq"', 3, true);
          public          postgres    false    215            `           2606    16597    medicines medicines_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_pkey PRIMARY KEY ("MedicineID");
 B   ALTER TABLE ONLY public.medicines DROP CONSTRAINT medicines_pkey;
       public            postgres    false    218            b           2606    16611    orders orders_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY ("OrderID");
 <   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_pkey;
       public            postgres    false    220            ^           2606    16590    users users_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY ("UserID");
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    216            �   o   x�34�.I-(���47�30�4�4202�50�56�24�tLN-�H-���44�����3?%�B�/���M���˒�9?� 1��,g��ׂ3 �(h|~.�tS�cd1z\\\ {�#G      �   w   x�3�4Ģ��Ԓ���N#N���Ԣ�.3NS �(��Z�1��qrsz槤V �s ŃKR�3Qt�pZ %�-B�4J�4�r��s
A�Ήyɩ99@�=... E�5h      �   [   x�3��H,�,΀R鹉�9z����&�f�Fz\ƜA���� y��E@6�:������!'X�!�Gjnb^I�FRjhd�iV���� 2#�     