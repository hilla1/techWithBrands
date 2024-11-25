// src/components/RelatedGigs.jsx
import React from 'react';
import GigCard from './GigCard';

const RelatedGigs = () => {
        const gigs = [
          {
            images: [
              'https://images.unsplash.com/photo-1519160558534-5796819a6d4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDF8fGdyYXBoaWMlMjBkZXNpZ258ZW58MHx8fHwxNjI5Nzc3ODcy&ixlib=rb-1.2.1&q=80&w=400',
              'https://images.unsplash.com/photo-1507764923504-cd90bf7da772?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDJ8fGdyYXBoaWMlMjBkZXNpZ258ZW58MHx8fHwxNjI5Nzc3ODcy&ixlib=rb-1.2.1&q=80&w=400',
            ],
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            name: 'John Doe',
            rating: '4.9',
            description: 'High-quality graphic design services for your brand.',
            price: '29.99',
          },
          {
            images: [
              'https://images.unsplash.com/photo-1498050108023-c5249f4df085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDV8fHNlbyUyMHNlcnZpY2VzfGVufDB8fHx8MTYyOTc3Nzg3Mg&ixlib=rb-1.2.1&q=80&w=400',
              'https://images.unsplash.com/photo-1515165562830-7634db1b4f98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDh8fHNlbyUyMHNlcnZpY2VzfGVufDB8fHx8MTYyOTc3Nzg3Mg&ixlib=rb-1.2.1&q=80&w=400',
            ],
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            name: 'Jane Smith',
            rating: '4.8',
            description: 'Expert SEO services to boost your website ranking.',
            price: '39.99',
          },
          {
            images: [
              'https://images.unsplash.com/photo-1529651737244-fc1d7d6fbc5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDd8fGNhbWVyeSUyMHNlcnZpY2VzfGVufDB8fHx8MTYyOTc3Nzg3Mg&ixlib=rb-1.2.1&q=80&w=400',
              'https://images.unsplash.com/photo-1542204629-41868e8430d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDl8fGNhbWVyeSUyMHNlcnZpY2VzfGVufDB8fHx8MTYyOTc3Nzg3Mg&ixlib=rb-1.2.1&q=80&w=400',
            ],
            avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
            name: 'Sam Wilson',
            rating: '4.7',
            description: 'Capture your precious moments with professional photography services.',
            price: '59.99',
          },
          {
            images: [
              'https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDEwfHxjYW1lcmElMjBzZXJ2aWNlc3xlbnwwfHx8fDE2Mjk3Nzc4NzI&ixlib=rb-1.2.1&q=80&w=400',
              'https://images.unsplash.com/photo-1514412076812-60f13ac283fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDJ8fGNhbWVyYSUyMHNlcnZpY2VzfGVufDB8fHx8MTYyOTc3Nzg3Mg&ixlib=rb-1.2.1&q=80&w=400',
            ],
            avatar: 'https://randomuser.me/api/portraits/women/55.jpg',
            name: 'Emma Brown',
            rating: '4.6',
            description: 'Capture your events with stunning videography and cinematography services.',
            price: '99.99',
          },
          {
            images: [
              'https://images.unsplash.com/photo-1513135227610-0d3f1a1f0a06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDJ8fHdlYnNpdGUlMjBkZXNpZ258ZW58MHx8fHwxNjI5Nzc3ODcy&ixlib=rb-1.2.1&q=80&w=400',
              'https://images.unsplash.com/photo-1517257075167-007d6fd91a35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDV8fHdlYnNpdGUlMjBkZXNpZ258ZW58MHx8fHwxNjI5Nzc3ODcy&ixlib=rb-1.2.1&q=80&w=400',
            ],
            avatar: 'https://randomuser.me/api/portraits/men/56.jpg',
            name: 'William Davis',
            rating: '4.9',
            description: 'Create a stunning and responsive website for your business.',
            price: '149.99',
          },
          // Continue adding more gigs with varied descriptions and images
          {
            images: [
              'https://images.unsplash.com/photo-1505692794404-b330268ec8ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDJ8fGNhcnBldCUyMGRlc2lnbnxlbnwwfHx8fDE2Mjk3Nzc4NzI&ixlib=rb-1.2.1&q=80&w=400',
              'https://images.unsplash.com/photo-1531168556460-75ed5c78901c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDJ8fGNhcnBldCUyMGRlc2lnbnxlbnwwfHx8fDE2Mjk3Nzc4NzI&ixlib=rb-1.2.1&q=80&w=400',
            ],
            avatar: 'https://randomuser.me/api/portraits/women/60.jpg',
            name: 'Sophia Johnson',
            rating: '4.5',
            description: 'Get unique and creative carpet design services for your home.',
            price: '199.99',
          },
          {
            images: [
              'https://images.unsplash.com/photo-1516318720514-d5ee1f0d630a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDR8fHBob3RvZ3JhcGh5JTIwc2VydmljZXN8ZW58MHx8fHwxNjI5Nzc3ODcy&ixlib=rb-1.2.1&q=80&w=400',
              'https://images.unsplash.com/photo-1497005367839-6e852de72767?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDl8fHBob3RvZ3JhcGh5JTIwc2VydmljZXN8ZW58MHx8fHwxNjI5Nzc3ODcy&ixlib=rb-1.2.1&q=80&w=400',
            ],
            avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
            name: 'Liam Taylor',
            rating: '4.8',
            description: 'Professional portrait photography sessions tailored to your needs.',
            price: '249.99',
          },
          {
            images: [
              'https://images.unsplash.com/photo-1545094862-4f1eecf1c0b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDExfHxkZXNpZ258ZW58MHx8fHwxNjI5Nzc3ODcy&ixlib=rb-1.2.1&q=80&w=400',
              'https://images.unsplash.com/photo-1529220502050-f15e570c634e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDd8fGRlc2lnbnxlbnwwfHx8fDE2Mjk3Nzc4NzI&ixlib=rb-1.2.1&q=80&w=400',
            ],
            avatar: 'https://randomuser.me/api/portraits/women/70.jpg',
            name: 'Isabella White',
            rating: '4.7',
            description: 'Expert logo and branding design to make your business stand out.',
            price: '299.99',
          },
        ];

        return (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-[var(--primary-color)]">Related Gigs</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {gigs.map((gig, index) => (
                <GigCard
                  key={index}
                  images={gig.images}
                  avatar={gig.avatar}
                  name={gig.name}
                  rating={parseFloat(gig.rating)}
                  description={gig.description}
                  price={parseFloat(gig.price)}
                />
              ))}
            </div>
          </div>
        );
};

export default RelatedGigs;
