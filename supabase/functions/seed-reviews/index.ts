import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UserProfile {
  email: string;
  fullName: string;
  country: string;
}

// Generate 300 diverse user profiles
const generateUserProfiles = (): UserProfile[] => {
  const profiles: UserProfile[] = [];
  
  const countries = [
    { name: 'Austria', firstNames: ['Lukas', 'Sophie', 'Maximilian', 'Anna', 'David', 'Laura', 'Thomas', 'Emma', 'Paul', 'Maria'], lastNames: ['Müller', 'Wagner', 'Berger', 'Huber', 'Schmid', 'Steiner', 'Bauer', 'Fischer', 'Gruber', 'Hoffmann'], count: 10 },
    { name: 'Germany', firstNames: ['Jan', 'Lisa', 'Michael', 'Sarah', 'Alexander', 'Julia', 'Sebastian', 'Nina', 'Felix', 'Hannah', 'Tobias', 'Lea', 'Lukas', 'Sophia', 'Jonas'], lastNames: ['Schmidt', 'Schneider', 'Weber', 'Meyer', 'Koch', 'Becker', 'Hoffmann', 'Schulz', 'Zimmerman', 'Klein', 'Wolf', 'Krüger', 'Richter', 'Braun', 'Fischer'], count: 15 },
    { name: 'France', firstNames: ['Pierre', 'Marie', 'Jean', 'Claire', 'Lucas', 'Emma', 'Alexandre', 'Léa', 'Thomas', 'Camille', 'Hugo', 'Manon'], lastNames: ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Petit', 'Richard', 'Durand', 'Moreau', 'Laurent', 'Simon', 'Michel'], count: 12 },
    { name: 'Italy', firstNames: ['Marco', 'Giulia', 'Lorenzo', 'Sofia', 'Alessandro', 'Francesca', 'Matteo', 'Chiara', 'Davide', 'Elena'], lastNames: ['Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco'], count: 10 },
    { name: 'Spain', firstNames: ['Carlos', 'María', 'David', 'Laura', 'Pablo', 'Carmen', 'Miguel', 'Ana', 'Javier', 'Isabel'], lastNames: ['García', 'Martínez', 'López', 'Sánchez', 'Pérez', 'González', 'Rodríguez', 'Fernández', 'Díaz', 'Torres'], count: 10 },
    { name: 'Netherlands', firstNames: ['Daan', 'Emma', 'Luuk', 'Sophie', 'Bram', 'Lisa', 'Thomas', 'Julia', 'Lars', 'Anna'], lastNames: ['de Vries', 'van den Berg', 'Janssen', 'Bakker', 'Visser', 'Smit', 'de Jong', 'van Dijk', 'Peters', 'Mulder'], count: 10 },
    { name: 'Poland', firstNames: ['Jakub', 'Anna', 'Michał', 'Katarzyna', 'Piotr', 'Maria', 'Tomasz', 'Magdalena', 'Krzysztof', 'Agnieszka'], lastNames: ['Nowak', 'Kowalska', 'Wiśniewski', 'Wójcik', 'Kowalczyk', 'Kamińska', 'Lewandowski', 'Zielińska', 'Szymański', 'Woźniak'], count: 10 },
    { name: 'Belgium', firstNames: ['Thomas', 'Sophie', 'Lucas', 'Emma', 'Maxime', 'Marie', 'Nicolas', 'Charlotte'], lastNames: ['Dubois', 'Laurent', 'Peeters', 'Janssens', 'Dupont', 'Maes', 'Jacobs', 'Mertens'], count: 8 },
    { name: 'Sweden', firstNames: ['Erik', 'Emma', 'Oscar', 'Maja', 'Viktor', 'Alice', 'Gustav', 'Linnea'], lastNames: ['Andersson', 'Johansson', 'Karlsson', 'Nilsson', 'Eriksson', 'Larsson', 'Olsson', 'Persson'], count: 8 },
    { name: 'Czech Republic', firstNames: ['Jan', 'Petra', 'Tomáš', 'Kateřina', 'Jakub', 'Lucie', 'Martin', 'Veronika'], lastNames: ['Novák', 'Svobodová', 'Novotný', 'Dvořáková', 'Černý', 'Procházková', 'Kučera', 'Veselá'], count: 8 },
    { name: 'Portugal', firstNames: ['João', 'Maria', 'Pedro', 'Ana', 'Tiago', 'Beatriz', 'Gonçalo', 'Inês'], lastNames: ['Silva', 'Santos', 'Costa', 'Ferreira', 'Oliveira', 'Rodrigues', 'Pereira', 'Alves'], count: 8 },
    { name: 'Greece', firstNames: ['Dimitrios', 'Eleni', 'Nikos', 'Sofia', 'Georgios', 'Maria', 'Panagiotis', 'Aikaterini'], lastNames: ['Papadopoulos', 'Georgiou', 'Konstantinou', 'Athanasiou', 'Nikolaou', 'Christodoulou', 'Ioannou', 'Petrou'], count: 8 },
    { name: 'Romania', firstNames: ['Andrei', 'Elena', 'Mihai', 'Alexandra', 'Constantin', 'Maria', 'Daniel', 'Gabriela'], lastNames: ['Popescu', 'Ionescu', 'Popa', 'Stan', 'Dumitrescu', 'Marin', 'Gheorghe', 'Cristea'], count: 8 },
    { name: 'Hungary', firstNames: ['Gábor', 'Anna', 'Péter', 'Eszter', 'László', 'Katalin', 'Zoltán', 'Mónika'], lastNames: ['Nagy', 'Kovács', 'Szabó', 'Tóth', 'Kiss', 'Varga', 'Horváth', 'Molnár'], count: 8 },
    { name: 'United Kingdom', firstNames: ['James', 'Emily', 'Oliver', 'Sophie', 'Harry', 'Amelia', 'George', 'Isabella', 'Jack', 'Charlotte', 'Oscar', 'Lily'], lastNames: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Davis', 'Wilson', 'Taylor', 'Anderson', 'Thomas', 'Roberts', 'Walker'], count: 12 },
    { name: 'United States', firstNames: ['Michael', 'Emma', 'David', 'Olivia', 'James', 'Sophia', 'William', 'Isabella', 'Benjamin', 'Mia', 'Alexander', 'Charlotte', 'Daniel', 'Ava', 'Matthew'], lastNames: ['Johnson', 'Williams', 'Brown', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore'], count: 15 },
    { name: 'Canada', firstNames: ['Liam', 'Emma', 'Noah', 'Olivia', 'William', 'Sophia', 'James', 'Charlotte', 'Benjamin', 'Amelia'], lastNames: ['MacDonald', 'Tremblay', 'Gagnon', 'Roy', 'Côté', 'Bouchard', 'Gauthier', 'Morin', 'Lavoie', 'Fortin'], count: 10 },
    { name: 'Ireland', firstNames: ['Conor', 'Aoife', 'Cian', 'Saoirse', 'Seán', 'Niamh', 'Patrick', 'Ciara'], lastNames: ['Murphy', 'Kelly', 'O\'Brien', 'Ryan', 'Walsh', 'O\'Connor', 'Byrne', 'McCarthy'], count: 8 },
    { name: 'Denmark', firstNames: ['Mikkel', 'Emma', 'Lucas', 'Sofia', 'Noah', 'Freja', 'Oliver', 'Isabella'], lastNames: ['Hansen', 'Nielsen', 'Jensen', 'Andersen', 'Pedersen', 'Christensen', 'Larsen', 'Sørensen'], count: 8 },
    { name: 'Finland', firstNames: ['Mikko', 'Emilia', 'Aleksi', 'Sofia', 'Eetu', 'Aino', 'Väinö', 'Liisa'], lastNames: ['Virtanen', 'Korhonen', 'Mäkinen', 'Nieminen', 'Hämäläinen', 'Laine', 'Heikkinen', 'Koskinen'], count: 8 },
    { name: 'Norway', firstNames: ['Lars', 'Emma', 'Magnus', 'Sofie', 'Henrik', 'Nora', 'Kristian', 'Ingrid'], lastNames: ['Olsen', 'Hansen', 'Johansen', 'Andersen', 'Larsen', 'Pedersen', 'Berg', 'Nilsen'], count: 8 },
    { name: 'Switzerland', firstNames: ['Lukas', 'Lena', 'Noah', 'Mia', 'David', 'Sophie', 'Leon', 'Emma'], lastNames: ['Müller', 'Meier', 'Schmid', 'Keller', 'Weber', 'Huber', 'Brunner', 'Baumann'], count: 8 },
    { name: 'Australia', firstNames: ['Jack', 'Olivia', 'Noah', 'Charlotte', 'William', 'Mia', 'Thomas', 'Isabella'], lastNames: ['Williams', 'Smith', 'Brown', 'Jones', 'Taylor', 'Wilson', 'Anderson', 'Martin'], count: 8 },
    { name: 'Bulgaria', firstNames: ['Ivan', 'Maria', 'Georgi', 'Elena', 'Stefan'], lastNames: ['Petrov', 'Ivanova', 'Dimitrov', 'Georgieva', 'Nikolov'], count: 5 },
    { name: 'Croatia', firstNames: ['Marko', 'Ana', 'Ivan', 'Petra', 'Luka'], lastNames: ['Horvat', 'Kovač', 'Babić', 'Novak', 'Jurić'], count: 5 },
    { name: 'Slovenia', firstNames: ['Luka', 'Maja', 'Jan', 'Nina', 'Tim'], lastNames: ['Novak', 'Horvat', 'Kovač', 'Krajnc', 'Zupan'], count: 5 },
    { name: 'Slovakia', firstNames: ['Marek', 'Lenka', 'Peter', 'Zuzana', 'Michal'], lastNames: ['Horváth', 'Varga', 'Kovács', 'Tóth', 'Nagy'], count: 5 },
    { name: 'Lithuania', firstNames: ['Jonas', 'Rūta', 'Mantas', 'Gabrielė', 'Tomas'], lastNames: ['Kazlauskas', 'Petraitė', 'Jonaitis', 'Stankevičiūtė', 'Butkus'], count: 5 },
    { name: 'Latvia', firstNames: ['Jānis', 'Anna', 'Mārtiņš', 'Līga', 'Andris'], lastNames: ['Bērziņš', 'Kalniņa', 'Ozoliņš', 'Liepiņa', 'Kalvāns'], count: 5 },
    { name: 'Estonia', firstNames: ['Markus', 'Liisa', 'Kristjan', 'Maria', 'Andrus'], lastNames: ['Tamm', 'Mägi', 'Sepp', 'Kask', 'Saar'], count: 5 },
    { name: 'Cyprus', firstNames: ['Andreas', 'Maria', 'Nikos', 'Elena', 'George'], lastNames: ['Georgiou', 'Christofi', 'Charalambous', 'Constantinou', 'Loizou'], count: 5 },
    { name: 'Luxembourg', firstNames: ['Marc', 'Sophie', 'Nicolas', 'Marie', 'Tom'], lastNames: ['Weber', 'Schmit', 'Klein', 'Muller', 'Becker'], count: 5 },
    { name: 'Malta', firstNames: ['Matthew', 'Rachel', 'David', 'Maria', 'John'], lastNames: ['Borg', 'Camilleri', 'Vella', 'Galea', 'Farrugia'], count: 5 },
  ];

  countries.forEach(country => {
    for (let i = 0; i < country.count; i++) {
      const firstName = country.firstNames[i % country.firstNames.length];
      const lastName = country.lastNames[i % country.lastNames.length];
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/'/g, '')}${i}@email${country.name.substring(0, 2).toLowerCase()}.com`;
      
      profiles.push({
        email,
        fullName: `${firstName} ${lastName}`,
        country: country.name
      });
    }
  });

  return profiles;
};

// Review templates
const reviewTemplates = [
  // Quality focused (40%)
  "Outstanding authenticity. All security features passed inspection perfectly.",
  "The print quality and materials are exactly as advertised. Very impressed with the detail.",
  "Holograms and UV features look completely genuine. Excellent craftsmanship throughout.",
  "Every detail matches official specifications. Top-tier quality work.",
  "Remarkable attention to detail. The security elements are flawless.",
  "Document quality exceeded expectations. All verification tests passed smoothly.",
  "Professional grade materials and printing. Looks and feels authentic.",
  "Impressive replication of security features. Very satisfied with the quality.",
  "The microtext and laser engraving are perfectly executed.",
  "Superior quality document. No issues with any authentication checks.",
  
  // Delivery & Service (30%)
  "Arrived 3 days ahead of schedule in discreet packaging. Professional service throughout.",
  "Delivery was right on time. Package tracking was accurate and reliable.",
  "Fast processing and secure shipping. Communication was excellent at every step.",
  "Received in perfect condition. The team kept me updated throughout delivery.",
  "Shipping was faster than expected. Very well packaged and protected.",
  "Excellent logistics. Arrived exactly when promised with full tracking details.",
  "Quick turnaround time. Packaging was secure and completely discreet.",
  "Delivery service was impeccable. No delays, arrived in pristine condition.",
  
  // Customer Experience (20%)
  "Support team answered all my questions promptly. Very professional interaction.",
  "Smooth process from start to finish. Clear instructions and helpful guidance.",
  "Had concerns about specifications but staff clarified everything. Great experience overall.",
  "Professional service throughout. Made the whole process easy and stress-free.",
  "Customer support was responsive and knowledgeable. Answered all queries quickly.",
  "The ordering process was straightforward. Good communication from the team.",
  "Helpful staff guided me through every step. Appreciated their professionalism.",
  
  // Overall Satisfaction (10%)
  "Exactly what I needed. Works flawlessly for my purposes.",
  "Would definitely use again. Reliable and trustworthy service.",
  "Perfect transaction. Met all my expectations and more.",
  "Highly recommend. Everything went smoothly from order to delivery.",
  "Very satisfied customer. The whole experience was professional and efficient.",
  "Great service overall. Will be returning for future needs.",
];

// Product lists
const allProducts = [
  // Driver's Licenses
  'license-austria', 'license-belgium', 'license-bulgaria', 'license-croatia', 'license-cyprus',
  'license-czech-republic', 'license-denmark', 'license-estonia', 'license-finland', 'license-france',
  'license-germany', 'license-greece', 'license-hungary', 'license-ireland', 'license-italy',
  'license-latvia', 'license-lithuania', 'license-luxembourg', 'license-malta', 'license-netherlands',
  'license-poland', 'license-portugal', 'license-romania', 'license-slovakia', 'license-slovenia',
  'license-spain', 'license-sweden', 'license-united-states', 'license-united-kingdom', 'license-canada',
  'license-australia', 'license-switzerland',
  // Passports
  'passport-austria', 'passport-belgium', 'passport-bulgaria', 'passport-croatia', 'passport-cyprus',
  'passport-czech-republic', 'passport-denmark', 'passport-estonia', 'passport-finland', 'passport-france',
  'passport-germany', 'passport-greece', 'passport-hungary', 'passport-ireland', 'passport-italy',
  'passport-latvia', 'passport-lithuania', 'passport-luxembourg', 'passport-malta', 'passport-netherlands',
  'passport-poland', 'passport-portugal', 'passport-romania', 'passport-slovakia', 'passport-slovenia',
  'passport-spain', 'passport-sweden', 'passport-united-states', 'passport-united-kingdom', 'passport-canada',
  'passport-australia', 'passport-switzerland',
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting seed process...');
    
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const userProfiles = generateUserProfiles();
    console.log(`Generated ${userProfiles.length} user profiles`);

    const createdUsers: { id: string; email: string }[] = [];
    const defaultPassword = 'TempPass123!'; // Users should change this

    // Create users in batches
    console.log('Creating user accounts...');
    for (let i = 0; i < userProfiles.length; i++) {
      const profile = userProfiles[i];
      
      try {
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: profile.email,
          password: defaultPassword,
          email_confirm: true,
          user_metadata: {
            full_name: profile.fullName
          }
        });

        if (authError) {
          console.error(`Error creating user ${profile.email}:`, authError.message);
          continue;
        }

        if (authData.user) {
          createdUsers.push({ id: authData.user.id, email: profile.email });
          
          // Create profile
          const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .insert({
              id: authData.user.id,
              full_name: profile.fullName,
              email: profile.email
            });

          if (profileError) {
            console.error(`Error creating profile for ${profile.email}:`, profileError.message);
          }
        }

        // Log progress every 50 users
        if ((i + 1) % 50 === 0) {
          console.log(`Created ${i + 1}/${userProfiles.length} users`);
        }
      } catch (error) {
        console.error(`Exception creating user ${profile.email}:`, error);
      }
    }

    console.log(`Successfully created ${createdUsers.length} users`);

    // Generate reviews distribution
    console.log('Generating review distributions...');
    const reviewsPerProduct = new Map<string, number>();
    allProducts.forEach(product => {
      const count = Math.floor(Math.random() * 7) + 7; // 7-13 reviews
      reviewsPerProduct.set(product, count);
    });

    // Shuffle users and products
    const shuffledUsers = [...createdUsers].sort(() => Math.random() - 0.5);
    const shuffledProducts = [...allProducts].sort(() => Math.random() - 0.5);

    // Track user review counts
    const userReviewCounts = new Map<string, number>();
    const reviews: any[] = [];

    // Distribute reviews
    let userIndex = 0;
    for (const product of shuffledProducts) {
      const productType = product.startsWith('license-') ? 'license' : 'passport';
      const reviewCount = reviewsPerProduct.get(product) || 10;

      for (let i = 0; i < reviewCount; i++) {
        // Find a user who hasn't reviewed 2 products yet
        while (userIndex < shuffledUsers.length && (userReviewCounts.get(shuffledUsers[userIndex].id) || 0) >= 2) {
          userIndex++;
        }

        if (userIndex >= shuffledUsers.length) {
          console.log('Ran out of eligible users, wrapping around');
          break;
        }

        const user = shuffledUsers[userIndex];
        const currentCount = userReviewCounts.get(user.id) || 0;
        userReviewCounts.set(user.id, currentCount + 1);

        // Generate rating between 3.5 and 5.0
        const rating = Math.round((Math.random() * 1.5 + 3.5) * 2) / 2;

        // Random review text
        const reviewText = reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];

        // Random date between 2019 and now
        const startDate = new Date('2019-01-01').getTime();
        const endDate = new Date().getTime();
        const randomDate = new Date(startDate + Math.random() * (endDate - startDate));

        reviews.push({
          user_id: user.id,
          product_type: productType,
          product_id: product,
          rating,
          review_text: reviewText,
          status: 'approved',
          created_at: randomDate.toISOString(),
          updated_at: randomDate.toISOString()
        });

        userIndex++;
      }
    }

    console.log(`Generated ${reviews.length} reviews`);

    // Insert reviews in batches of 100
    console.log('Inserting reviews...');
    for (let i = 0; i < reviews.length; i += 100) {
      const batch = reviews.slice(i, i + 100);
      const { error: reviewError } = await supabaseAdmin
        .from('reviews')
        .insert(batch);

      if (reviewError) {
        console.error(`Error inserting review batch ${i / 100 + 1}:`, reviewError.message);
      } else {
        console.log(`Inserted batch ${i / 100 + 1} (${batch.length} reviews)`);
      }
    }

    console.log('Seed process completed!');

    return new Response(
      JSON.stringify({
        success: true,
        usersCreated: createdUsers.length,
        reviewsCreated: reviews.length,
        message: 'Database seeded successfully! Default password for all accounts is: TempPass123!'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Seed error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
