package org.example.backproject.service;

import lombok.RequiredArgsConstructor;
import org.example.backproject.entity.Bookmark;
import org.example.backproject.entity.Restaurants;
import org.example.backproject.entity.Users;
import org.example.backproject.repository.BookmarkRepository;
import org.example.backproject.repository.RestaurantsRepository;
import org.example.backproject.repository.UsersRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookmarkService {
    private final BookmarkRepository bookmarkRepository;
    private final UsersRepository usersRepository;
    private final RestaurantsRepository restaurantsRepository;

    @Transactional(readOnly = true)
    public List<Bookmark> getUserBookmarksByEmail(String email) {
        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        return bookmarkRepository.findByUserId(user.getId());
    }

    @Transactional
    public void toggleBookmarkByEmail(String email, Long restaurantId) {
        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        Restaurants restaurant = restaurantsRepository.findById(restaurantId)
                .orElseThrow(() -> new RuntimeException("레스토랑을 찾을 수 없습니다."));

        if (bookmarkRepository.existsByUserIdAndRestaurantId(user.getId(), restaurantId)) {
            bookmarkRepository.deleteByUserIdAndRestaurantId(user.getId(), restaurantId);
        } else {
            Bookmark bookmark = new Bookmark();
            bookmark.setUser(user);
            bookmark.setRestaurant(restaurant);
            bookmarkRepository.save(bookmark);
        }
    }
} 